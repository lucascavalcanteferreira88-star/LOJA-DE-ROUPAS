let cart = [];


// ADICIONAR PRODUTO AO CARRINHO

function addToCart(name, price, selectId) {

    const sizeElement = document.getElementById(selectId);

    const selectedSize = sizeElement.value;

    const item = {

        id: Date.now(),

        name: name,

        price: price,

        size: selectedSize

    };

    cart.push(item);

    updateCartUI();
}


// REMOVER PRODUTO DO CARRINHO

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    updateCartUI();
}


// ATUALIZAR INTERFACE DO CARRINHO

function updateCartUI() {

    // Atualiza contador

    document.getElementById('cart-count').innerText = cart.length;


    const cartItemsContainer =
        document.getElementById('cart-items');

    const cartTotalElement =
        document.getElementById('cart-total-price');


    // Se o carrinho estiver vazio

    if (cart.length === 0) {

        cartItemsContainer.innerHTML =
            '<p class="empty-cart">Seu carrinho está vazio.</p>';

        cartTotalElement.innerText = '0,00';

        return;
    }


    // Limpa o carrinho

    cartItemsContainer.innerHTML = '';


    let total = 0;


    // Adiciona cada produto

    cart.forEach(item => {

        total += item.price;


        const itemElement =
            document.createElement('div');

        itemElement.className = 'cart-item';


        itemElement.innerHTML = `

            <div>

                <strong>${item.name}</strong>

                <br>

                <small>
                    Tam: ${item.size} -
                    R$ ${item.price.toFixed(2)}
                </small>

            </div>

            <button
                class="btn-remove"
                onclick="removeFromCart(${item.id})"
            >
                X
            </button>

        `;


        cartItemsContainer.appendChild(itemElement);

    });


    // Atualiza o total

    cartTotalElement.innerText =
        total.toFixed(2).replace('.', ',');
}


// FINALIZAR PEDIDO

function submitOrder(event) {

    event.preventDefault();


    // Verifica se existem produtos

    if (cart.length === 0) {

        alert(
            'Adicione pelo menos um produto ao carrinho antes de finalizar!'
        );

        return;
    }


    const name =
        document.getElementById('name').value;

    const phone =
        document.getElementById('phone').value;

    const address =
        document.getElementById('address').value;


    // Confirmação do pedido

    alert(
        `Obrigado pela compra, ${name}!\n\n` +
        `Seu pedido foi confirmado e será entregue em:\n` +
        `${address}\n\n` +
        `Entraremos em contato pelo telefone ${phone}.`
    );


    // Limpa o carrinho

    cart = [];

    updateCartUI();


    // Limpa o formulário

    document.getElementById('order-form').reset();

}