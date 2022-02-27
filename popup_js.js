let jap_title = 'NO_JAP_TITLE'
let eng_title = 'NO_ENG_TITLE'
let syn = 'NO_SYN'
let ch = 'Unknown'
let auth = 'NO_AUTH'

let clickEvent = new Event('click');


document.addEventListener('DOMContentLoaded', function () {
    // GET jap_title ELEMENTS
    let jap_title_text = document.getElementsByClassName('jap_title_text')[0]
    let jap_title_checkbox = document.getElementsByClassName('jap_title_checkbox')[0]
    // GET eng_title ELEMENTS
    let eng_title_text = document.getElementsByClassName('eng_title_text')[0]
    let eng_title_checkbox = document.getElementsByClassName('eng_title_checkbox')[0]
    // GET syn MAIN DIV
    let syn_main_div = document.getElementById('syn')
    // GET auth ELEMENTS
    let auth_text = document.getElementsByClassName('auth_text')[0]
    let auth_checkbox = document.getElementsByClassName('auth_checkbox')[0]
    // GET ch ELEMENTS
    let ch_text = document.getElementsByClassName('ch_text')[0]
    let ch_checkbox = document.getElementsByClassName('ch_checkbox')[0]
    // GET result ELEMENTS
    let result_button = document.getElementsByClassName('result_button')[0]
    let result_textarea = document.getElementsByClassName('result_textarea')[0]

    // CREATE SYN DIV
    let syn_div = document.createElement('div')
    syn_div.setAttribute("class", "syn_elem")
    // CREATE SYN TEXT INPUT
    let syn_text = document.createElement('input')
    syn_text.setAttribute("type", "text")
    syn_text.setAttribute("class", "syn_text")
    // CREATE SYN CHECKBOX INPUT
    let syn_checkbox = document.createElement('input')
    syn_checkbox.setAttribute("type", "checkbox")
    syn_checkbox.setAttribute("class", "syn_checkbox")
    // PUT ALL TOGETHER
    syn_div.appendChild(syn_text)
    syn_div.appendChild(syn_checkbox)

    // ADD EVENT TO CHECKBOX AND BUTTON
    jap_title_checkbox.addEventListener("click", update_result)
    eng_title_checkbox.addEventListener("click", update_result)
    ch_checkbox.addEventListener("click", update_result)
    auth_checkbox.addEventListener("click", update_result)
    result_button.addEventListener("click", copy_result)


    // ON WINDOW FULL LOADED
    chrome.tabs.query( {currentWindow: true, active : true}, function(tabArray){

        // GET jap_title
        chrome.tabs.sendMessage(tabArray[0].id, 'jap_title', function (response) {

            if(response != undefined) {
                jap_title = response

                // WRITE JAPANESE TITLE INSIDE TEXT BOX AND CHECK CHECKBOX
                if(jap_title != 'NO_JAP_TITLE') {
                    jap_title_text.value = jap_title
                    jap_title_checkbox.checked = true
                    auth_checkbox.dispatchEvent(clickEvent)
                }
            }
        })

        // GET eng_title
        chrome.tabs.sendMessage(tabArray[0].id, 'eng_title', function (response) {
            if(response != undefined) {
                eng_title = response

                // WRITE ENGLISH TITLE INSIDE TEXT BOX AND CHECK CHECKBOX
                if(eng_title != 'NO_ENG_TITLE') {
                    eng_title_text.value = eng_title
                    eng_title_checkbox.checked = true
                    auth_checkbox.dispatchEvent(clickEvent)
                }
            }
        })

        // GET syn
        chrome.tabs.sendMessage(tabArray[0].id, 'syn', function (response) {
            if(response != undefined) {
                syn = response

                // WRITE SYNONYMS INSIDE TEXT BOX BUT DON'T CHECK CHECKBOX
                if(syn != 'NO_SYN') {
                    let syn_array = syn.split(', ')

                    for(let i=0; i<syn_array.length; i++) {
                        syn_text.value = syn_array[i]
                        syn_main_div.appendChild(syn_div.cloneNode(true))
                        syn_main_div.lastChild.lastChild.addEventListener("click", update_result)
                    }
                }
                else {
                    syn_main_div.appendChild(syn_div)
                }
            }
        })

        // GET auth
        chrome.tabs.sendMessage(tabArray[0].id, 'auth', function (response) {
            if(response != undefined) {
                auth = response

                // WRITE AUTHORS INSIDE TEXT BOX AND CHECK CHECKBOX
                if(auth != 'NO_AUTH') {
                    auth_text.value = auth
                    auth_checkbox.checked = true
                    auth_checkbox.dispatchEvent(clickEvent)
                }
            }
        })

        // GET ch
        chrome.tabs.sendMessage(tabArray[0].id, 'ch', function (response) {
            if(response != undefined) {
                ch = response

                // WRITE CHAPTERS INSIDE TEXT BOX AND CHECK CHECKBOX
                if(ch != 'Unknown') {
                    ch_text.value = ch
                }
                ch_checkbox.checked = true  // (alwais checked as default)
                auth_checkbox.dispatchEvent(clickEvent)
            }
        })

    })

    function update_result() {
        result_textarea.value = '- '

        // WRITE JAPANESE TITLE
        if((jap_title_checkbox.checked == true) && (jap_title_text.value != '')) {
            result_textarea.value += jap_title_text.value + ' ';
        }

        // WRITE ENGLISH TITLE
        if((eng_title_checkbox.checked == true) && (eng_title_text.value != '') && (eng_title != jap_title)) {
            result_textarea.value += '(' + eng_title_text.value + ') ';
        }

        // WRITE SYNONYMS
        let syn_text_array = document.getElementsByClassName('syn_text')
        let syn_checkbox_array = document.getElementsByClassName('syn_checkbox')
        for(let j=0; j<syn_checkbox_array.length; j++) {
            if((syn_checkbox_array[j].checked == true) && (syn_text_array[j].value != '')) {
                result_textarea.value += '(' + syn_text_array[j].value + ') ';
            }
        }

        // WRITE CHAPTERS
        if((auth_checkbox.checked == true) && (auth_text.value != '')) {
            result_textarea.value += '(By ' + auth_text.value + ') ';
        }

        // WRITE AUTHORS
        if(ch_checkbox.checked == true) {
            result_textarea.value += '[' + ch_text.value + ']';
        }

        result_textarea.style.height = "0px";  // RESET HEIGHT
        result_textarea.style.height = result_textarea.scrollHeight + "px";
    }
    
    function copy_result() {
        navigator.clipboard.writeText(result_textarea.value)
    }

}, false)
