import spacy

nlp = spacy.load("en_core_web_sm")
doc = nlp("Ok today I have to find something to wear for fri cuz I don't think I have time any other day this week.. I'm thinking all black and pearls!")

for token in doc:
    print(token.text, token.lemma_, token.pos_, token.tag_, token.dep_,
            token.shape_, token.is_alpha, token.is_stop)
