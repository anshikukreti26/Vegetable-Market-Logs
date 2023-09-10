let searchForm = document.querySelector('.search-form');
document.querySelector('#search-btn').onclick = () =>
{
    searchForm.classList.toggle('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}
const placeOrderButton = document.getElementById('payment');
placeOrderButton.addEventListener('click', function() {
  window.location.href = 'payment'; 
    });

let loginForm = document.querySelector('.login-form');
document.querySelector('#login-btn').onclick = () =>
{
  window.location.href = "login";
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    navbar.classList.remove('active');
}

let navbar = document.querySelector('.navbar');
document.querySelector('#menu-btn').onclick = () =>
{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
}

window.onscroll = () =>
{
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
}

//changed from here
const cart_on_home=document.querySelector('#cart-btn');
cart_on_home.addEventListener('click',()=>{
  cart.classList.add('cart-active');
});

const btnCart=document.querySelector('#cart-icon');
const cart=document.querySelector('.cart');
const btnClose=document.querySelector('#cart-close');

btnCart.addEventListener('click',()=>{
  cart.classList.add('cart-active');
});

btnClose.addEventListener('click',()=>{
  cart.classList.remove('cart-active');
});

document.addEventListener('DOMContentLoaded',loadFood);

function loadFood(){
  loadContent();

}

function loadContent(){
  //Remove Food Items  From Cart
  let btnRemove=document.querySelectorAll('.cart-remove');
  btnRemove.forEach((btn)=>{
    btn.addEventListener('click',removeItem);
  });

  //Product Item Change Event
  let qtyElements=document.querySelectorAll('.cart-quantity');
  qtyElements.forEach((input)=>{
    input.addEventListener('change',changeQty);
  });

  //Product Cart
  
  let cartBtns=document.querySelectorAll('.add-cart');
  cartBtns.forEach((btn)=>{
    btn.addEventListener('click',addCart);
  });

  updateTotal();
}


//Remove Item
function removeItem(){
  if(confirm('Are Your Sure to Remove')){
    let title=this.parentElement.querySelector('.cart-food-title').innerHTML;
    itemList=itemList.filter(el=>el.title!=title);
    this.parentElement.remove();
    loadContent();
  }
}

//Change Quantity
function changeQty(){
  if(isNaN(this.value) || this.value<1){
    this.value=1;
  }
  loadContent();
}

let itemList=[];

//Add Cart
function addCart(){
 let food=this.parentElement;
 let title=food.querySelector('.food-title').innerHTML;
 let price=food.querySelector('.food-price').innerHTML;
 let imgSrc=food.querySelector('.food-img').src;
 //console.log(title,price,imgSrc);
 
 let newProduct={title,price,imgSrc}

 //Check Product already Exist in Cart
 if(itemList.find((el)=>el.title==newProduct.title)){
  alert("Product Already added in Cart");
  return;
 }else{
  itemList.push(newProduct);
 }


let newProductElement= createCartProduct(title,price,imgSrc);
let element=document.createElement('div');
element.innerHTML=newProductElement;
let cartBasket=document.querySelector('.cart-content');
cartBasket.append(element);
loadContent();
}


function createCartProduct(title,price,imgSrc){

  return `
  <div class="cart-box">
  <img src="${imgSrc}" class="cart-img">
  <div class="detail-box">
    <div class="cart-food-title">${title}</div>
    <div class="price-box">
      <div class="cart-price">${price}</div>
       <div class="cart-amt">${price}</div>
   </div>
    <input type="number" value="1" class="cart-quantity">
  </div>
  <ion-icon name="trash" class="cart-remove"></ion-icon>
</div>
  `;
}

function updateTotal()
{
  const cartItems=document.querySelectorAll('.cart-box');
  const totalValue=document.querySelector('.total-price');

  let total=0;

  cartItems.forEach(product=>{
    let priceElement=product.querySelector('.cart-price');
    let price=parseFloat(priceElement.innerHTML.replace("Rs.",""));
    let qty=product.querySelector('.cart-quantity').value;
    total+=(price*qty);
    product.querySelector('.cart-amt').innerText="Rs."+(price*qty);

  });

  totalValue.innerHTML='Rs.'+total;


  // Add Product Count in Cart Icon

  const cartCount=document.querySelector('.cart-count');
  let count=itemList.length;
  cartCount.innerHTML=count;

  if(count==0){
    cartCount.style.display='none';
  }else{
    cartCount.style.display='block';
  }


}


document.getElementById('signupForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent default form submission
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  // Send registration data to the server
  const response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: username,
      password: password
    })
  });

  if (response.ok) {
    // Registration successful, redirect to login page
    window.location.href = 'login.html';
  } else {
    // Handle registration error
    const errorMessage = await response.text();
    alert('Registration failed: ' + errorMessage);
  }
});


// Populate the vegetable dropdown
const vegetableDropdown = document.getElementById('vegetable');
fetch('/vegetables')
  .then(response => response.json())
  .then(data => {
    data.vegetables.forEach(vegetable => {
      const option = document.createElement('option');
      option.value = vegetable.name;
      option.textContent = vegetable.name;
      vegetableDropdown.appendChild(option);
    });
  });



