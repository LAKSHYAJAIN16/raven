file1 = open(r'D:\Projects\v3\raven\ml\data\classes_zero_image.txt', 'r')
Lines = file1.readlines()


def key_array():
    keys = []
    for i in Lines:
        try:
            # Split
            keyWord = i.split(":")[1].replace("\n", "").replace(" ", "")
            keys.append(keyWord)
        except:
            continue
    print(keys)
    return keys


def key_comma():
    keys = key_array()
    key_comma_act = ", ".join(keys)
    print(key_comma_act)
    return key_comma_act


key_comma()
