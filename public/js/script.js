// const form = document.getElementById("signupform");
// const username = document.getElementById("username");
// const email = document.getElementById("email");
// const password = document.getElementById("password");

// form.addEventListener("submit", (e) => {
//     let valid = true;

//     if (!validateUsername(username.value)) {
//         valid = false;
//     }

//     if (!validateEmail(email.value)) {
//         valid = false;
//     }

//     if (!validatePassword(password.value)) {
//         valid = false;
//     }

//     if (!valid) {
//         e.preventDefault(); // Prevent form submission if validation fails
//         alert("Please fix the validation errors before submitting.");
//     }
//     else {
//         swal("Good job!", "product Add successfully!", "success");
//     }
// });

// function validateUsername(username) {
//     const namePattern = /^[A-Za-z\s]+$/;
//     const usernamewarning = document.getElementById("usernamewarning");

//     if (username.trim === "" || !namePattern.test(username)) {
//         usernamewarning.textContent = "*Username is not valid.";
//         usernamewarning.style.color = "red";
//         return false;
//     } else {
//         usernamewarning.textContent = "";
//         return true;
//     }
// }

// function validateEmail(email) {
//     const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
//     const emailwarning = document.getElementById("emailwarning");

//     if (!emailPattern.test(email)) {
//         emailwarning.textContent = "*Email address is not valid.";
//         emailwarning.style.color = "red";
//         return false;
//     } else {
//         emailwarning.textContent = "";
//         return true;
//     }
// }

// function validatePassword(password) {
//     // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
//     const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
//     const passwordwarning = document.getElementById("passwordwarning");

//     if (!passwordPattern.test(password)) {
//         passwordwarning.textContent = "Password must be at least 8 ";
//         passwordwarning.style.color = "red";
//         return false;
//     } else {
//         passwordwarning.textContent = "";
//         return true;
//     }
// }


  if (window.location.href=="http://localhost:3100/index" ||window.location.href=="http://localhost:3100/login") {
  
const imageUrls = [
    'images/ProParts.png',
    'images/engine-1.png',
    'images/engine-2.png',
    'images/engine-3.png'
];

let currentIndex = 0;
const imageElement = document.getElementById('searchimage');

function changeImage() {
    imageElement.style.opacity = 0;

    setTimeout(() => {
        imageElement.src = imageUrls[currentIndex];
        currentIndex = (currentIndex + 1) % imageUrls.length;
        imageElement.style.opacity = 1;
    }, 500); 
}

setInterval(changeImage, 3000);
changeImage();

}
// =====================================================


document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signupform");
    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const phone = document.getElementById("phone");
    const gstNumber = document.getElementById("gst_number");
    const upiId = document.getElementById("upi_id");
    const panNumber = document.getElementById("pan_number");

    form.addEventListener("submit", (e) => {
       // e.preventDefault(); // Prevent automatic form submission

        let valid = true;

        if (!validateUsername(username.value)) {
            valid = false;
        }

        if (!validateEmail(email.value)) {
            valid = false;
        }

        if (!validatePassword(password.value)) {
            valid = false;
        }

        if (!validatePhone(phone.value)) {
            valid = false;
        }

        if (!validateGSTNumber(gstNumber.value)) {
            valid = false;
        }

        if (!validateUPIId(upiId.value)) {
            valid = false;
        }

        if (!validatePanNumber(panNumber.value)) {
            valid = false;
        }

        if (!valid) {
            //form.submit(); // Submit the form if all fields are valid
             e.preventDefault();
            // alert("Please fix the validation errors before submitting.");
        } else {
            swal("Good job!", "product Add successfully!", "success");
   
        }
    });

    function validateUsername(username) {
        const namePattern = /^[A-Za-z\s]+$/;
        const usernamewarning = document.getElementById("usernamewarning");

        if (username.trim === "" || !namePattern.test(username)) {
            usernamewarning.textContent = "Username is not valid.";
            return false;
        } else {
            usernamewarning.textContent = "";
            return true;
        }
    }

    function validateEmail(email) {
        const emailPattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        const emailwarning = document.getElementById("emailwarning");

        if (!emailPattern.test(email)) {
            emailwarning.textContent = "Email address is not valid.";
            return false;
        } else {
            emailwarning.textContent = "";
            return true;
        }
    }

    function validatePassword(password) {
    // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    const passwordwarning = document.getElementById("passwordwarning");

    if (!passwordPattern.test(password)) {
        passwordwarning.textContent = "Password must be at least 8 ";
        passwordwarning.style.color = "red";
        return false;
    } else {
        passwordwarning.textContent = "";
        return true;
    }
}

    // function validatePassword(password) {
    //     const passwordPattern = /^(?=.\d)(?=.[a-z])(?=.*[A-Z]).{6,}$/;
    //     const passwordwarning = document.getElementById("passwordwarning");

    //     if (!passwordPattern.test(password)) {
    //         passwordwarning.textContent = "Password must be at least 6 characters, including uppercase, lowercase, and a number.";
    //         return false;
    //     } else {
    //         passwordwarning.textContent = "";
    //         return true;
    //     }
    // }

    function validatePhone(phone) {
        const phonePattern = /^\d{10}$/; 
        const phonewarning = document.getElementById("phonewarning");

        if (!phonePattern.test(phone)) {
            phonewarning.textContent = "Phone number is not valid.";
            return false;
        } else {
            phonewarning.textContent = "";
            return true;
        }
    }

    function validateGSTNumber(gstNumber) {
         const gstPattern = /^[A-Z0-9]{15}$/;
        const gstdwarning = document.getElementById("gstdwarning");

        if (!gstPattern.test(gstNumber)) {
            gstdwarning.textContent = "GST Number is not valid.";
            return false;
        } else {
            gstdwarning.textContent = "";
            return true;
        }
    }

    function validateUPIId(upiId) {
        const upiPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+$/;
        const upiwarning = document.getElementById("upiwarning");

        if (!upiPattern.test(upiId)) {
            upiwarning.textContent = "UPI ID is not valid.";
            return false;
        } else {
            upiwarning.textContent = "";
            return true;
        }
    }

    function validatePanNumber(panNumber) {
        const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const panwarning = document.getElementById("panwarning");

        if (!panPattern.test(panNumber)) {
            panwarning.textContent = "PAN Number is not valid.";
            return false;
        } else {
            panwarning.textContent = "";
            return true;
        }
    }
});

// ==================================== AJAX =============================================================

document.getElementById('Models').addEventListener('change', function () {
    const selectedModel = this.value;
    const carVariantSelect = document.getElementById('varientName');
   
    fetch(`/displayVarientsAjax?model=${selectedModel}`).then(response => response.json()).then(data => {
            carVariantSelect.innerHTML = '';
             
            
            const option = document.createElement('option');
                option.value = null;
                option.textContent = "Select Varient";
                carVariantSelect.appendChild(option);
                data.forEach(variant => {
                const option = document.createElement('option');
                option.value = variant;
                option.textContent = variant;
                carVariantSelect.appendChild(option);
            });
        });
    });
     
    document.getElementById('Brands').addEventListener('change', 
    
    function () {
    const selectedBrand = this.value;
    const carModelSelect = document.getElementById('Models');
    
    fetch(`/displayModelsAjax?brand=${selectedBrand}`).then(response => response.json()).then(data => {
        carModelSelect.innerHTML = '';
        const option = document.createElement('option');
        option.value = null;
        option.textContent = "Select Model";
        carModelSelect.appendChild(option);


            data.forEach(Model => {
                const option = document.createElement('option');
                option.value = Model;
                option.textContent = Model;
                carModelSelect.appendChild(option);
         
            });
        });
    });
  
  
    document.getElementById('varientName').addEventListener('change', function () {
    const selectedvarient = this.value;
    const startYearSelect = document.getElementById('startYear');
    model=document.getElementById('Models').value
    fetch(`/displayYearAjax?Model=${model}`).then(response => response.json()).then(data => {
        startYearSelect.innerHTML = '';
        const option = document.createElement('option');
        option.value = null;
        option.textContent = "Select Year";
        startYearSelect.appendChild(option);
            data.forEach(Year => {
                const option = document.createElement('option');
                option.value = new Date(Year.startYear).getFullYear();
                option.textContent = new Date(Year.startYear).getFullYear();
                startYearSelect.appendChild(option);
            });
        });
    });

    window.onload=()=>{
        console.log(window.location.href);
        if (window.location.href=="http://localhost:3001/seller/addproduct"|| window.location.href=="http://localhost:3001/login"|| window.location.href=="localhost:3001") {
            fetchCategories() 
        }
        fetchBrands();
        
        if (window.location.href=="http://localhost:3001/index"|| window.location.href=="http://localhost:3001/login"|| window.location.href=="http://localhost:3001/") {
            console.log("Vikas");
           
        fetchCategoriescards() 
        }

        };

    function fetchBrands(){
        console.log("Fetch Brands Runned");
        const Brand= document.getElementById('Brands')
        fetch(`/displayBrandsAjax?brand=all`)
        .then(response => response.json())
        .then(data => {
            Brand.innerHTML = '';
            const option = document.createElement('option');
                option.value = null;
                option.textContent = "Select Brand";
                Brand.appendChild(option);
                data.forEach(Brands => {
                const option = document.createElement('option');
                option.value = Brands._id;
                option.textContent = Brands.brandName;
                Brand.appendChild(option);
            });
        });
    }

    function fetchCategories(){
        console.log("In Side If Of  get Categoris ");
       const url = `/seller/getCategories`;
       selectCategories= document.getElementById('selectCategories')
   
       fetch(url)
         .then(response => {
           if (!response.ok) {
             throw new Error('Network response was not ok');
           }
           return response.json();
         })
         .then(data => {
           selectCategories.innerHTML = '';
           console.log("Categories recived");
               const option = document.createElement('option');
               option.value = null;
               option.textContent = "Select Catagory";
               selectCategories.appendChild(option);
               data.forEach(Brands => {
               const option = document.createElement('option');
               option.value = Brands.categoryName;
               option.textContent = Brands.categoryName;
               selectCategories.appendChild(option);
           });
       }).catch(error => {
           console.error('There was a problem with the fetch operation in Categories:', error);
         });

    }



    
    function fetchCategoriescards(){
        console.log("In Side If Of  get Categoris ");
       const url = `/seller/getCategories`;
       categoriesDiv= document.getElementById('categoriesDiv')
   
       fetch(url)
         .then(response => {
           if (!response.ok) {
             throw new Error('Network response was not ok');
           }
           return response.json();
         })
         .then(data => {
            // categoriesDiv.innerHTML = '';
           console.log("Categories recived");
           //    option.value = Brands.categoryName;
               data.forEach(Brands => {
                categoriesDiv.innerHTML += `<div
                class="col-6 col-sm-3 col-md-2  p-1 d-flex align-items-center justify-content-center">
                <a class="d-inline-block text-decoration-none"  href="/showProductsbyCategory/${Brands.categoryName}"> 
                <div class=" card-shadow w-100 h-100 bg-white cata-box p-1 p-1">
                <div  style="max-height: 150px; overflow: hidden; " >
                  <img src="../../uploads/${Brands.image1}" class="categoryImg" width="150px" height="150px" alt="${Brands.categoryName}" >
                 </div>
                <center>${Brands.categoryName}</center>
                </div>
                </a>
            </div>`

           
        });
       }).catch(error => {
           console.error('There was a problem with the fetch operation in Categories:', error);
         });

    }
fetchCategoriescards()

   





    
//    document.getElementById('searchbyfilterBtn').addEventListener('click', function () {
//     const selectedBrand = document.getElementById("Brands").value;
//     const selectedModel = document.getElementById("Models").value;
//     const selectedVarient = document.getElementById("varientName").value;
//     const selectedYear = document.getElementById("startYear").value;
  
//     console.log(selectedBrand + " " + selectedModel + " " + selectedVarient + " " + selectedYear);
//     const url = `/searchByFilter?carName=${selectedModel}&brandId=${selectedBrand}&varientName=${selectedVarient}&startYear=${selectedYear}`;

//     fetch(url)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.json();
//       })
//       .then(data => {
//       })
//       .catch(error => {
//         console.error('There was a problem with the fetch operation:', error);
//       });
//   });














  console.log("Hello hii");
