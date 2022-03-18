const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

cards.addEventListener("click", (e) => {
  addCarrito(e);
});

items.addEventListener('click', e =>{
  btnAccion(e)
})

const fetchData = async () => {
  try {
    const res = await fetch("http://localhost:4000/productosOfertas");
    const data = await res.json();

    pintarCard(data);
  } catch (error) {
    console.log(error);
  }
};

const pintarCard = (data) => {
  // console.log(data)
  data.forEach((producto) => {
    templateCard.querySelector(".card-img-top").setAttribute("src", producto.img);
    templateCard.querySelector("h5").textContent = producto.precio ;
    templateCard.querySelector("h6").textContent = producto.nombre;
    templateCard.querySelector(".card-link").dataset.id = producto.id;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });

  cards.appendChild(fragment);
};

const addCarrito = (e) => {

  if (e.target.classList.contains("card-link")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};


const setCarrito = (objeto) => {
  const producto = {
    id: objeto.querySelector(".card-link").dataset.id,
    precio: objeto.querySelector("h5").textContent,
    nombre: objeto.querySelector("h6").textContent,
    cantidad: 1,
  };

  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = { ...producto };
  pintarCarrito();
};

const pintarCarrito = () => {
  console.log(carrito);
  items.innerHTML = ``;
  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector('.cantidad').textContent=producto.cantidad
    templateCarrito.querySelector('.producto').textContent=producto.nombre;
    templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
    templateCarrito.querySelector("span").textContent =producto.cantidad * producto.precio;

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });

  items.appendChild(fragment);

  pintarFooter();
};

const pintarFooter = () => {
  footer.innerHTML = ``;
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `
    <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
    `

    return
  }

  const nCantidad = Object.values(carrito).reduce((acc,{cantidad})=> acc+cantidad,0)
  const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc+cantidad*precio,0)

  templateFooter.querySelectorAll('td')[0].textContent = nCantidad
  templateFooter.querySelector('span').textContent = nPrecio

  const clone = templateFooter.cloneNode(true)
  fragment.appendChild(clone)
  footer.appendChild(fragment)

  const btnVaciar = document.getElementById('vaciar-carrito')
  btnVaciar.addEventListener('click', ()=>{
    carrito = {}
    pintarCarrito()
  })

}

const btnAccion = e =>{
  if(e.target.classList.contains('btn-info')){
    console.log(carrito[e.target.dataset.id])
    const producto = carrito[e.target.dataset.id]
    producto.cantidad = carrito[e.target.dataset.id].cantidad+1
    carrito[e.target.dataset.id]={...producto}
    pintarCarrito()
  }

  else if(e.target.classList.contains('btn-danger')){
    const producto = carrito[e.target.dataset.id]
    producto.cantidad = carrito[e.target.dataset.id].cantidad-1
    if(producto.cantidad === 0){
      delete carrito[e.target.dataset.id]
    }
    pintarCarrito()
}

e.stopPropagation()
}

