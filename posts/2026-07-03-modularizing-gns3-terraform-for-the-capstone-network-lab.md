---
title: "Modularizing GNS3 Terraform for the Capstone Network Lab"
date: 2026-07-03
---

My capstone project deploys a simulated corporate network in GNS3 using Terraform. Each department segment (R&D, Robotics) has an identical topology: one Open vSwitch, three VPCS workstations, one Docker server, and the links connecting them all to a central VyOS router. When I first wrote this out, each department was its own flat `.tf` file with every resource hardcoded. Today I refactored the duplicated code into a reusable Terraform module and cut the deployment configuration nearly in half.

## The Problem: Copy-Paste Departments

Before modularization, the GNS3 local environment had three separate files handling the topology:

- `gns3-network.tf` (25 lines) — the project, NAT, router, and uplink
- `gns3-compute_rnd.tf` (84 lines) — R&D switch, 3 PCs, server, and all links
- `gns3-compute_robotics.tf` (85 lines) — Robotics switch, 3 PCs, server, and all links

Total: **194 lines** across 3 files.

The two compute files were nearly identical. Every resource block was copy-pasted with only the department name, subnet, and router adapter number changed. Adding a third department meant duplicating another 85 lines and changing a handful of values. Worse, updating one department meant remembering to fix it in every other file too.

Here's what a single department looked like — every PC declared individually, every link hardcoded:

```hcl
resource "gns3_template" "pc_rd_1" {
    project_id  = gns3_project.capstone.id
    name        = "pc1"
    template_id = data.gns3_template_id.vpcs.id
}
resource "gns3_template" "pc_rd_2" {
    project_id  = gns3_project.capstone.id
    name        = "pc2"
    template_id = data.gns3_template_id.vpcs.id
}
resource "gns3_template" "pc_rd_3" {
    project_id  = gns3_project.capstone.id
    name        = "pc3"
    template_id = data.gns3_template_id.vpcs.id
}
```

Three identical blocks that differ only in their resource name suffix. Multiply that pattern across PCs, links, switches, and servers for each department and it adds up fast.

## The Module: `gns3_network_base`

I extracted the repeated topology into a single module at `modules/gns3_network_base/`. It creates one complete department segment — switch, PCs, server, and all links — from a set of input variables:

```hcl
# modules/gns3_network_base/main.tf (63 lines)

resource "gns3_template" "switch" {
  project_id  = var.project_id
  name        = "${var.department_name} Switch"
  template_id = var.switch_template_id
}

resource "gns3_template" "pc" {
  count       = var.pc_count
  project_id  = var.project_id
  name        = "pc${count.index + 1}"
  template_id = var.vpcs_template_id
}

resource "gns3_link" "pc" {
  count          = var.pc_count
  project_id     = var.project_id
  node_a_id      = gns3_template.switch.id
  node_a_adapter = count.index + 1
  node_a_port    = 0
  node_b_id      = gns3_template.pc[count.index].id
  node_b_adapter = 0
  node_b_port    = 0
}

resource "gns3_docker" "server" {
  project_id    = var.project_id
  name          = "server_${lower(replace(var.department_name, " ", "_"))}"
  image         = var.server_image
  start_command = "sh -c 'ip addr add ${var.server_subnet}.2/16 dev eth0 && ip route add default via ${var.server_gateway} && nginx -g \"daemon off;\"'"
}
```

The key change: `count = var.pc_count` replaces three separate resource blocks with one that scales to any number of workstations. The links use the same count and index into the PC array directly.

## The Environment: Module Calls

The `environments/gns3-local/main.tf` now declares the core infrastructure once, then calls the module for each department:

```hcl
module "dept_rnd" {
  source = "../../modules/gns3_network_base"

  project_id         = gns3_project.capstone.id
  department_name    = "R&D"
  switch_template_id = data.gns3_template_id.openvswitch.id
  vpcs_template_id   = data.gns3_template_id.vpcs.id
  router_node_id     = gns3_template.router_main.id
  router_adapter     = 1
  pc_count           = 3
  server_image       = "nginx:alpine"
  server_subnet      = "10.1.0"
  server_gateway     = "10.1.0.1"
}

module "dept_robotics" {
  source = "../../modules/gns3_network_base"

  project_id         = gns3_project.capstone.id
  department_name    = "Robotics"
  switch_template_id = data.gns3_template_id.openvswitch.id
  vpcs_template_id   = data.gns3_template_id.vpcs.id
  router_node_id     = gns3_template.router_main.id
  router_adapter     = 2
  pc_count           = 3
  server_image       = "nginx:alpine"
  server_subnet      = "10.2.0"
  server_gateway     = "10.2.0.1"
}
```

Each department is now a 12-line module call instead of an 85-line resource dump.

## By the Numbers

| Metric | Before | After |
|--------|--------|-------|
| Deployment files | 3 (`gns3-network.tf`, 2 compute files) | 1 (`main.tf`) |
| Lines in environment | 194 | 63 |
| Lines saved in environment | — | **131** |
| To add a new department | ~85 lines copy-paste | ~12 lines module call |

The module itself is 63 lines of main logic plus 51 lines of variable definitions and 29 lines of outputs. But that code is written once and reused for every department.

## Advantages Beyond Line Count

**Consistency.** Every department is guaranteed to have the same topology. No chance of one department having a misconfigured link or missing a server because someone forgot to copy a block.

**Scalability.** Adding a third department (say, Manufacturing) is a 12-line module call. Changing the number of PCs per department is a single variable. The `count` meta-argument handles the rest.

**Testability.** The module can be validated in isolation. If the switch-to-PC link logic is correct in the module, it's correct everywhere it's used.

**Separation of concerns.** The environment file deals with what departments exist and their parameters. The module deals with how a department is wired. Changes to topology live in one place; changes to deployment scope live in another.

**Maintainability.** A bug fix or improvement to the department topology (adding a monitoring port, changing the server networking) happens once in the module and propagates everywhere.

## Project Structure

The final layout separates reusable modules from execution environments:

```
cyberdyne-capstone/
├── modules/
│   ├── gns3_network_base/    # Generic department segment
│   └── aws_vpc_base/         # Cloud routing (future)
│
└── environments/
    ├── gns3-local/           # Local GNS3 lab (uses gns3_network_base)
    └── aws-cloud/            # AWS deployment (uses aws_vpc_base)
```

This pattern — modules as reusable blueprints, environments as parameterized deployments — scales well as the project grows. The same `gns3_network_base` module could deploy identical segments in a different GNS3 project or a CI test environment without any code changes.

## Takeaways

If you're using Terraform with GNS3 and find yourself duplicating resource blocks for similar network segments, pull them into a module. The upfront cost is minimal (define your variables, wire up the outputs) and the payoff is immediate: less code, fewer bugs, and trivial scaling. The `count` meta-argument alone eliminates the most egregious copy-paste patterns — no reason to declare `pc1`, `pc2`, `pc3` as separate resources when `count = var.pc_count` does the same thing dynamically.
