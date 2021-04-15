let docUser = ""
let docEmail = ""
let docId = ""

let setUp = function(template, username, email, id) {
    switch(template) {
        case "verify":
            docUser = username
            docEmail = email
            docId = id 
            let verificationEmail = `<div style="font-family: sans-serif; background: #fafafa; height: 100%; padding: 0; margin: 0; width: auto; text-align: justify; "><p style="text-align:center;margin-bottom:30px"><img style="width: 80%; max-width: 300px;" src="https://ci6.googleusercontent.com/proxy/FG7ctqNaQRwB3iMUQZeNSoZtjZ6cS1LWu82SXpQTuaQ9JA58phu88pdMcKPp1rcL0IHAm3VkndYPMo0=s0-d-e1-ft#https://i.postimg.cc/Jn7XtPZY/EVAK01.png" alt="EVAK_main_logo" tabindex="0">
</p>

<h1 style="text-align: center;">Üdvözöljük az EVAK rendszerében, ${docUser}!</h1>

<p>Köszönjük a regisztrációját! Kérjük erősítse meg a felhasználói fiókját! Kattintson a 'Regisztráció megerősítése'
    gombra, vagy másolja ki az alatta lévő linket, és illessze be a böngésző keresősávjába!</p><br>

<a style="padding:20px; background:#ccff00;border-radius:5px;display: block;position: relative; text-decoration:none;font-family:sans-serif;font-weight:700;color:black; text-align: center; align-content: center;"
        href="https://www.evak.hu/verify?id=${docId}" target="_blank">Regisztráció
        megerősítése</a><br>
<p style="text-decoration:none;color:grey"><a href="https://www.evak.hu/verify?id=${docId}" target="_blank">https://www.evak.hu/verify?id=${docId}</a>
</p>

<p style="text-decoration:none;color:grey">
    Amennyiben bármilyen problémába ütközne a rendszer használata során, kérjük vegye fel velünk a kapcsolatot az
    '<a href="mailto:info@evak.hu" target="_blank">info@evak.hu</a>' e-mail címen!
</p>

<br>
Köszönjük!
<br>

<strong>Egyszerűsített Villanyszerelő Árajánlat Kezelő rendszer</strong>

<br><br>
<hr style="border:2px solid #eaeef3;border-bottom:0;margin:20px 0">
<p style="text-align:center;color:#969696">
    Ezt a levelet a '<a href="mailto:${docEmail}" target="_blank">${docEmail}</a>' címre
    küldtük. Amennyiben tévesen kapta, kérjük jelezze nekünk e-mail-ben!
</p>
</div>`
            return verificationEmail;
    }
    }






module.exports = {
    setUp
}