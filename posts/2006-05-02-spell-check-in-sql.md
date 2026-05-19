---
title: "Spell Check In SQL"
date: 2006-05-02
---

 I was tasked yesterday with writing a spell checker for an up-and-coming application. I completed the meat of the functionality today, done in sql. It's actually very acurate, pulling most words within the first 15 suggestions, but many within the first 5. It uses a table comprised of 62,070 words (a dictionary I imported from a flat file word list), which speaks to the procedure's accuracy as there are many names, cities, acronyms, etc., with the corresponding soundex values. I could have calculated the soundex values on the fly, but thought it would be more efficent having them stored as the words will not be edited. Even if they are going to be, I will require editing to be done through a stored procedure which will calculate the soundex value for the word and store it as well. The procedure will pull, sort and return over 400 records in about one second. The procedure pulls all words with a similar soundex value and with a similar structure and sorts them alphabetically in relation to the misspelled word.

The assumptions that were made in creating this function were 1) the majority of the words misspelled would be longer ones and 2) the misspellings would occur in the middle or towards the end of the word. The procedure takes the misspelled word, the precision value and has an output variable containing the suggestions (a comma delimited string) of up to 5000 characters. The precision value (a number between 1 and 3, 1 being the most precise, 3 returning the most suggestions) will effect how the procedure searches the table for the words, which in turn, affects the number of choices. For example, the soundex value of the misspelled word "dogg" is D200. So, using a precision value of 1, the procedure will search for anything with a soundex value of D20% (where percent is anything, in this case D20-D209). With a precision value of 2, it will search for words with the soundex value of D2% (D200 - D299). The higher the precision value, the more words it will return. With a precision value of 3, the procedure will return all the words that have a soundex value of D%. This means, all the words that start with the letter D. Obviously, you don't want a precision value of 4 (% or every word in the dictionary, ouch).

The soundex value is an alpha-numeric representaion of how the word sounds. The words "dawg" and "dog" have the same soundex value, D200. It's not perfect, and does nothing to sort the words. So I also searched for words that fit the structure. The procedure will look for words that match, with a precision value of 1, do% and %og. So this will return words with the same structure. Again, with a precision value of 2, it will return anything matching d%, or %g, a ton of words obviously. In most cases, one shouldn't have to use anything but the precision value of 1. The function will then sort the words. It takes the misspelled word and looks for words in the result set matching do%. It adds them to the comma delimited string, in alphabetical order, then deletes them from the result set. It then searches the remaining for d% and adds those. For a larger word, such as apple, it will search the result set for appl%, app%, ap%, then a% making the string in a specific to general order. So the finished product is a combination of soundex matches, structure matches ordered by structural similarity to the original, misspelled word.

Here is the function:

```


IF OBJECT_ID('spGetSuggest') IS NOT NULL
DROP PROC spGetSuggest
GO
--Jacob Steelsmith
--05/01/06
--spGetSuggest
--
--Stored procedure used to get a word
--with a similar soundex value.
--@nvchWord the misspelled word.
--@intPrecision - number representing the
----the range of the search. 1 returns the
----most precise search results (the least
----possible number of matches). 3 returns
----everything that begins with the first
----letter of the misspelled word.
--@vchReturnString - A comma delimted string
----that contains the possible values up to
----5000 characters.
CREATE PROC spGetSuggest
@nvchWord NVARCHAR(50),
@intPrecision INTEGER = 1,
@vchReturnString VARCHAR(5000) OUTPUT
AS

BEGIN TRAN GetWord

--declare vars
DECLARE @vchReturnValues VARCHAR(5000)
DECLARE @intCounter INTEGER
DECLARE @vchWordSoundex VARCHAR(5)
DECLARE @intCounter2 INTEGER
DECLARE @nvchTempWord NVARCHAR(50)

--default the counter
SET @intCounter = 0

--get the soundex of the word to compare
SET @vchWordSoundex =
(SOUNDEX(@nvchWord))

--default the return values
SET @vchReturnValues = ''

--default the soundex to 3 (we don't want
--a larger value than that. a larger value
--will pull all the words from the dictionary)
IF(@intPrecision > 3)
	SET @intPrecision = 3

--make sure the word isn't blank
IF(@nvchWord != '')
BEGIN

	--trim the end of the soundex value by the precision value
	SET @vchWordSoundex = LEFT(@vchWordSoundex, (4 - @intPrecision))

	--insert % for each number in the precision value
	--so if the soundex is T567 and the precision is 1, then the new
	--soundex value will be T56%. If the precision is 2, then the new
	--value is T5%%
	WHILE(@intCounter < @intPrecision)
	BEGIN
		SET @vchWordSoundex = @vchWordSoundex + '%'
		SET @intCounter = @intCounter + 1
	END

	--load the temp table with possible matches.
	--we're searching for, and words that match the left side of the word, minus
	--a character for each precision value, and words that match the right side
	--of the word minus a character for each precision value.
	SELECT * INTO #tmpWordTable
	FROM tblWords
	WHERE vchSoundex LIKE @vchWordSoundex
	OR nvchWord LIKE (LEFT(@nvchWord, LEN(@nvchWord) - @intPrecision) + '%')
	OR nvchWord LIKE ('%' + RIGHT(@nvchWord, LEN(@nvchWord) - @intPrecision))

	--setup the counter
	SET @intCounter2 = 1	

	--loop through the length of the word less one character
	WHILE(@intCounter2 < LEN(@nvchWord))
	BEGIN
		--get the words from the temp table
		--that are like the word minus the counter
		--with a % added to it. For example, if the
		--word is duck and the counter is at two, the
		--search value will be du%
		DECLARE getWords CURSOR FOR
		(SELECT DISTINCT nvchWord
		FROM #tmpWordTable
		WHERE nvchWord LIKE (LEFT(@nvchWord, LEN(@nvchWord) - @intCounter2) + '%'))

		--initialize the cursor
		OPEN getWords
		FETCH NEXT FROM getWords
		INTO @nvchTempWord

		--loop through the selected words
		WHILE(@@FETCH_STATUS = 0)
		BEGIN

			--append the word string with the word, then a comma
			SET @vchReturnValues = @vchReturnValues + @nvchTempWord + ','

			--delete the word from the temp table
			DELETE FROM #tmpWordTable
			WHERE nvchWord = @nvchTempWord

			--get the next word in the selection
			FETCH NEXT FROM getWords
			INTO @nvchTempWord
		END

		--deinitialize the cursor
		CLOSE getWords
		DEALLOCATE getWords

		--increment the counter
		SET @intCounter2 = @intCounter2 + 1
	END	

	--trim the extra comma
	SET @vchReturnValues = LEFT(@vchReturnValues, (LEN(@vchReturnValues) - 1))

	--set the return value
	SET @vchReturnString = @vchReturnValues

	--drop the temp table
	DROP TABLE #tmpWordTable
END

COMMIT TRAN GetWord
GO
```

This procedure will be used by another procedure that checks for the word, then if it is misspelled, gets the suggestions, or returns a misspelled flag if the caller simply wants to know it's misspelled.