# DESCRIPTION
I want to create a graphical extension that, when you click it, display the japanese title, english title, synonyms, chapters and authors of the manga page you are currently browsing in the MyAnimeList site. The informations are displayed like this:
> \- **jap\_title** (**eng\_title**) (By **auth**) \[**ch**\]


# RULES
- The english title (and brackets) should not be displayed if it's the same as the japanese title
- The english title can be exchanged for a synonym if the latter is more used
- If the english title is not present on the page, empty brackets should not be displayed
- If the chapters are not present (in numerical form), the square brackets must be empty


# BASE
The project is based on this script written by me:
```python
import re
import requests


link = input("manga link: ")
print("-"*80)

name = ''
eng_name = ''
auth = ''
ch = ''
syn = ''
final_text = ''

req_get = requests.get(link)
txt = str(req_get.content)
#print(txt)

#name search
m = re.search('itemprop="name">(.+?)<', txt)
if m:
    name = m.group(1).strip().replace('&#039;', '\'')
    print(name)
else:
    print('** no name **')

#eng_name search
m = re.search('English:</span>(.+?)<', txt)
if m:
    eng_name = m.group(1).strip().replace('&#039;', '\'')
    print(eng_name)
else:
    print('** no eng_name **')

#auth search
m = re.search('Authors:</span>(.+?)</div>', txt)
if m:
    n = re.findall(">(.+?)</a>", m.group(1))
    for o in n:
        auth += o + ' & '
    auth = auth.strip(' &').replace(',', '')
    print(auth)
else:
    print('** no auth **')

#ch search
m = re.search('Chapters:</span>(.+?)<', txt)
if m:
    ch = m.group(1).strip().replace('\\n', '')
    print(ch)
else:
    print('** no ch **')

#syn search
m = re.search('Synonyms:</span>(.+?)<', txt)
if m:
    syn = m.group(1).strip().replace('&#039;', '\'').split(', ')
    print('__________')
    print("Synonyms:")
    for s in syn:
        print(f"- {s}")
    print('¯¯¯¯¯¯¯¯¯¯')  # print('\u00AF' * 10)
else:
    print('** no syn **')
    print('----------')


final_text += f'- {name} '
if (bool(eng_name) & (eng_name.lower() != name.lower())):
    final_text += f'({eng_name}) '
final_text += f'(By {auth}) '
if not ch.isnumeric():
    ch = ''
final_text += f'[{ch}]'
print(final_text)

req_get.close()
```

# DISCLAIMER
I have some experience in programming and I've learned Python as self-taught. Also as self-taught I will learn HTML, CSS and JavaScript to create this project. Feel free to correct me from any errors in the code.


# LICENSE
This repository and all the code it contains can be copied and edited by anyone.
