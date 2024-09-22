'use strict'

const startForm = Date.now()

function onsection1change (e) {
    const pValue = parseInt(getvalue('P').value)
    const eValue = parseInt(getvalue('E').value)
    const sValue = parseInt(getvalue('S').value)
    const spValue = parseInt(getvalue('Sp').value)
    const fValue = parseInt(getvalue('F').value)

    const totalscore = pValue + eValue + sValue + spValue + fValue

    const section2 = document.getElementById('section2')
    const psh = document.getElementById('psh')
    if (totalscore >= 2) {
        section2.style.display = 'table'
        psh.style.display = 'table-row'
        onsection2change(e)
    } else {
        section2.style.display = 'none'
        psh.style.display = 'none'
        document.getElementById('shsresult').innerText = 'No'
    }
}

function onsection2change (e) {
    const aValue = getvalue('A').value
    const bValue = getvalue('B').value

    const shsresult = 'No'
    const pshresult = 'No'

    if (aValue === 'yes' && bValue === 'yes') {
        shsresult = 'Yes'
        pshresult = 'Yes'
    } else if (aValue === 'no' && bValue === 'yes') {
        shsresult = 'Yes'
        pshresult = 'Yes'
    } else if (aValue === 'yes' && bValue === 'no') {
        shsresult = 'Yes'
    }

    document.getElementById('shsresult').innerText = shsresult
    document.getElementById('pshresult').innerText = pshresult
}

function getvalue (elementname) {
    const query = 'input[name="' + elementname + '"]:checked'
    const element = document.querySelector(query)
    if (element) {
        return { value: element.value, valid: true }
    }
    return { value: 0, valid: false }
}

function submitform () {
    // Set this to the URL of a server endpoint which accepts POST data in
    // JSON format.
    const serverURL = ''

    if(!serverURL) {
        throw new Error('Server URL not set.')
    }

    //age validation
    const ageValue = document.getElementById('age').value

    const ageValueInt = parseInt(ageValue)
    if (ageValue === '' || ageValueInt > 110 || ageValueInt < 18) {
        window.alert('Please enter valid age (18 to 110)\nForm not submitted.')
        return
    }

    //institution , patient id, setting, 
    const institutionValue = document.getElementById('institution').value
    const patientid = document.getElementById('patientid').value
    const settingValue = document.getElementById('setting').value
    const genderValue = document.getElementById('gender').value
    const eduValue = document.getElementById('edu').value
    const empValue = document.getElementById('emp').value
    const pttValue = document.getElementById('ptt').value


    // validation to check if inst and pt is empty

    if (empValue === '' || pttValue === '' || eduValue === '' || institutionValue === '' || patientid === '' || settingValue === '' || genderValue === '') {
        window.alert('Please Enter all fields. \nForm not submitted.')
        return
    }
    const pValue = getvalue('P')
    const eValue = getvalue('E')
    const sValue = getvalue('S')
    const spValue = getvalue('Sp')
    const fValue = getvalue('F')


    const aValue = getvalue('A')
    const bValue = getvalue('B')

    const shsresult = document.getElementById('shsresult').innerText
    const pshresult = document.getElementById('pshresult').innerText
    const errMsg = 'Fill all values and try again. \nForm not submitted.'

    var allValid = pValue.valid && eValue.valid && sValue.valid && spValue.valid && fValue.valid
    if (!allValid) {
        window.alert(errMsg)
        return
    }

    const totalscore = parseInt(pValue.value) + parseInt(eValue.value) + parseInt(sValue.value) + parseInt(spValue.value) + parseInt(fValue.value)
    if (totalscore >= 2) {
        if (!(aValue.valid && bValue.valid)) {
            window.alert(errMsg)
            return
        }

    }
    else {
        aValue.value = 'NA'
        bValue.value = 'NA'
    }

    //find elapsed time and reset starting time
    const elapsed = Math.floor((Date.now() - startForm) / 1000)


    const formdata = {
        Institution: institutionValue,
        PatientId: patientid,
        P: pValue.value,
        E: eValue.value,
        S: sValue.value,
        Sp: spValue.value,
        F: fValue.value,
        A: aValue.value,
        B: bValue.value,
        SHS: shsresult,
        PSH: pshresult,
        ElapsedSec: elapsed,
        Setting: settingValue,
        Age: ageValue,
        Gender: genderValue,
        Edu: eduValue,
        Emp: empValue,
        Ptt: pttValue

    }


    fetch(serverURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(formdata)
    })
        .then(function (response) {
            if (response.ok) {
                window.alert('Thank you. Form Submitted.')
                location.reload()
            } else {
                window.alert(errMsg)
            }
        })
        .catch(function (err) {
            window.alert('ERROR:' + err)
        })
}
