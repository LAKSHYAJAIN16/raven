import nltk
import json
from nltk import word_tokenize, pos_tag, RegexpParser
nltk.download('averaged_perceptron_tagger')     
text = """
Other friends have similar stories, of how they were treated brusquely by Laurelwood staff, and as often as not, the same names keep coming up. About a half-dozen friends of mine refuse to step foot in there ever again because of it. How many others they're telling - and keeping away - one can only guess.
"""
tokens = word_tokenize(text)
print(tokens)
tag = pos_tag(tokens)
print(tag)
grammar = """
    NP: {<DT|PRP\$>?<JJ.*>*<NN.*>+}       # chunk determiner (optional), adjectives (optional), and one or more nouns
    PP: {<IN><NP>}                        # chunk preposition followed by a noun phrase
    VP: {<VB.*><NP|PP|CLAUSE>+}           # chunk verb followed by noun phrase, prepositional phrase, or subordinate clause
"""
cp = RegexpParser(grammar)
result = cp.parse(tag)
print(json.dumps(result))
# It will draw the pattern graphically which can be seen in Noun Phrase chunking
result.draw()
