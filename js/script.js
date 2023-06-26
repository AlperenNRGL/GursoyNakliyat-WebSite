const search_icon = document.querySelector(".search-icon");
const close_icon = document.querySelector(".close-icon");
const navbar_container = document.querySelector(".navbar .container");
const dropdown_menu = document.querySelector(".dropdown-btn")


search_icon.addEventListener("click", (e) => {
    navbar_container.classList.toggle("show")
})

close_icon.addEventListener("click", (e) => {
    navbar_container.classList.toggle("show")
})


function menu() {
    dropdown_menu.classList.toggle("show")
}



const check_buttons = document.querySelectorAll(".control-group input");
const form_groups = document.querySelectorAll(".teklif-box .form-group");

check_buttons.forEach(b => {
    b.addEventListener("click", (e) => {
        document.querySelector(".teklif-box .form-group.show").classList.remove("show")
        form_groups.item(Number(e.target.value - 1)).classList.add("show");

    })
})


const sertifika_modal = document.querySelector(".sertifika-box");

function modal_process() {
    sertifika_modal.classList.toggle("show");
}



const all_flex = document.querySelectorAll(".eight-block .flex");

all_flex.forEach(e => e.addEventListener("click", () => {

    e.classList.toggle("show")
    e.nextElementSibling.classList.toggle("show")

}))



//? Mail Gönderme


document.querySelectorAll("#teklif-button").forEach(element => {
    element.addEventListener("click", (e) => {
        e.preventDefault();

        const form = e.target.parentElement.parentElement.querySelectorAll("input");
        console.log(form);
        let data = {
            "yuklemeulkesi": form[0].value,
            "bosaltmaulkesi": form[1].value,
            "isim": form[2].value,
            "email": form[3].value,
            "telefon": form[4].value,
            "yuklemetarihi": form[5].value,
            "konu": form[6].value,
        }
        console.log(data);

        fetch("http://gursoyapi-env-1.eba-4yw6nw8k.us-east-1.elasticbeanstalk.com/mailgonder", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(data => {
                for (let i = 0; i < form.length - 1; i++) {
                    form[i].value = ""
                }
            })
            .catch(err => console.log(err))
    })
});






//? Gönderi Sorgulama 


document.getElementById("gonderiSorgula").addEventListener("submit", (e) => {
    const gonderiNumarası = document.getElementById("gonderi-input").value;
    console.log(gonderiNumarası);
    document.getElementById("gonderi-input").value = ""
    // clearElement();
    e.preventDefault();
    if (gonderiNumarası == "") {
        document.querySelector(".first-block .header").classList.add("notnumber")
        setTimeout(() => document.querySelector(".first-block .header").classList.remove("notnumber"), 3000);
        return;
    }


    fetch(`http://gursoyapi-env-1.eba-4yw6nw8k.us-east-1.elasticbeanstalk.com/${gonderiNumarası}`)
        .then(response => response.json())
        .then(result => {

            //? Bu şekilde veri gelip gelmediğini anladım.
            if (JSON.stringify(result).length < 3) {
                throw new Error("Bilinmedik bir hata meydana geldi.")
            }
            document.getElementById("modal").style.display = "block"
            //? Statu
            const statu = result.statu
            document.getElementById("statu").innerHTML = statu == "Done" ? "Tamamlandı" : statu
            //? Gonderi Numarası
            document.getElementById("gonderiNuamrası").innerHTML = gonderiNumarası
            //? Sipariş Tarihi
            document.getElementById("siparisTarihi").innerHTML = result.siparisTarihi
            //? Tahmini Teslim
            const tahminiTeslim = result.tahminiTeslim;
            document.getElementById("teslimTarihi").innerHTML = tahminiTeslim

            if (statu == "Done" || statu == "Sipariş" || statu == "Tamamlandı" || statu == "Teslim Edildi") {
                document.querySelector(".siparis-modal .location").style.display = "none"
            } else {
                // ? Yolda
                document.querySelector(".location").style.display = "block"
                document.getElementById("location").innerHTML = result.address
            }
            console.log(result.dorsePlaka);
            //? Surucu
            document.getElementById("surucu").innerHTML = result.surucu;
            //? Cekici Dorse Plaka
            document.getElementById("cekiciPlaka").innerHTML =`${result.cekiciPlaka}<br>${result.dorsePlaka}` 
            //? Yukleme Ulkesi
            document.getElementById("yuklemeUlkesi").innerHTML = result.yuklemeUlkesi
            //? Teslim Ulkesi
            document.getElementById("teslimUlkesi").innerHTML = result.teslimUlkesi

        })
        .catch(error => {
            console.log(error);
            document.querySelector(".first-block .header").classList.add("errornumber")
            setTimeout(() => document.querySelector(".first-block .header").classList.remove("errornumber"), 3000)
        })

})



function close_modal(){
    document.getElementById("modal").style.display = "none"
}



