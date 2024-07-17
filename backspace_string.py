def backspace_string(str1,str2):
    i = len(str1) - 1
    j = len(str2) - 1
    i_hash = 0
    j_hash = 0
    while i != j and i >= 0 and j >= 0:
        while str1[i] == '#' or i_hash > 0:
            if str1[i] == '#':
                i_hash += 1
            else:
                i_hash -= 1
            i -= 1
        while str2[j] == '#' or j_hash > 0:
            if str2[j] == '#':
                j_hash += 1
            else:
                j_hash -= 1
            j -= 1
        assert j_hash == 0
        assert i_hash == 0
        assert str1[i] != '#'
        assert str2[j] != '#'
        # at this point i and j must land on a character
        if str1[i] != str2[j]:
            return False
        i -= 1
        j -= 1
    return True
# test the method

# ab#c, ad#c
assert backspace_string('ab#c','ad#c') == True