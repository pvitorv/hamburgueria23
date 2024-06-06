const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("addres-warn")



let cart = [];

//################ ABRIR MODAL DO CARRINHO #############################################
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

//################# FECHAR O MODAL DO CARRINHO#####################################
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function( ){
    cartModal.style.display = "none"
})

//################# ADD ITENS NO CARRINHO#############################################
menu.addEventListener("click", function(event){
    //console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})



//###########FUNÇÃO PARA ADD AO CARRINHO#########
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //se o item já exitir aumentar apenas a quantidade do mesmo
        existingItem.quantity += 1;
    }else{

    cart.push({
       name,
       price,
       quantity: 1, 
    })

    }

    updateCartModal()
}

//######################## FUNÇÃO ATUALIZA O CARRINHO ########################################

function updateCartModal(){
   cartItemsContainer.innerHTML = "";
   let total = 0;
   
   cart.forEach(item =>{
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "jstify-between", "flex-col" )

    cartItemElement.innerHTML = `
    
    <div class="flex items-center justify-between">
        <div>
        <p class="font-medium">${item.name}</p>
        <p>Qtd:${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(1)}</p>
        </div>
        <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
    </div>
    `
    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement)
   })
   cartTotal.textContent = total.toLocaleString("pt-BR",{
    style: "currency",
    currency:"BRL"
   });

   cartCounter.innerHTML = cart.length;
}

//#################### FUNÇÃO PARA REMOVER ITEM DO CARRINHO ################################

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")


        removeItemCart(name);
    }

})


function removeItemCart(name) {
   const index = cart.findIndex(item => item.name === name);   
    
   if(index !== -1){
       const item = cart[index];

       

      if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

//####################### CAMPO DO ENDEREÇO ###################################

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

//######################### FINALIZAR CARRINHO ################################################

checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestourantOpen();
    if(!isOpen){
        Toastify({
            text:"Ops já estamos fechados" ,
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "left", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
    }

    //#######  ENVIAR O PEDIDO ##########

    const cartItems = cart.map((item)=>{
        return(
            `${item.name}  Quantidade:(${item.quantity})  Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "64996035082"

    window.open(`https://wa.me/${phone}?text=${message} Endereço:${addressInput.value}`, `_blank`)

    cart = [];
    updateCartModal();


})   

//############################## VALIDAÇÃO DE HORARIO DE FUNCIONAMENTO  #############################################

function checkRestourantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 1 && hora < 23;
    // true restaurante está aberto!
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestourantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}