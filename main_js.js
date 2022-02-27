let title_elem = document.querySelector('[itemprop=name]').innerText.split('\n')
let jap_title = 'NO_JAP_TITLE'
let eng_title = 'NO_ENG_TITLE'
let other_elem = document.getElementsByClassName('spaceit_pad')
let syn = 'NO_SYN'
let ch = 'Unknown'
let auth = 'NO_AUTH'

    // GET jap_title AND eng_title
jap_title = title_elem[0].trim()  // GET jap_title
if(title_elem.length > 1)
    eng_title = title_elem[1].trim()  // GET eng_title

    // GET syn, ch AND auth
for(let i=0; i < other_elem.length; i++) {
    if(other_elem[i].innerText.includes('Synonyms'))
        syn = other_elem[i].innerText.replace('Synonyms: ', '').trim()  // GET syn
    else if(other_elem[i].innerText.includes('Chapters'))
        ch = other_elem[i].innerText.replace('Chapters: ', '').trim()  // GET ch
    else if(other_elem[i].innerText.includes('Authors'))
        auth = other_elem[i].innerText.replaceAll(/Authors: |\(.+?\)/gi, '').replace(' , ', ' & ').replaceAll(',', '').trim()  // GET auth
}

console.log(jap_title)
console.log(eng_title)
console.log(syn)
console.log(ch)
console.log(auth)

/*
sessionStorage.setItem('jap_title', jap_title)
sessionStorage.setItem('eng_title', eng_title)
sessionStorage.setItem('syn', syn)
sessionStorage.setItem('ch', ch)
sessionStorage.setItem('auth', auth)
*/

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch(request) {
        case 'jap_title':
            sendResponse(jap_title)
            break;
        case 'eng_title':
            sendResponse(eng_title)
            break;
        case 'syn':
            sendResponse(syn)
            break;
        case 'ch':
            sendResponse(ch)
            break;
        case 'auth':
            sendResponse(auth)
            break;
    }
})