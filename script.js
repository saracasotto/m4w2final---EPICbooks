document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('bookList');  //main div
    const cart = document.getElementById('cart');
    const searchInput = document.getElementById('searchInput');
    const emptyCartButton = document.getElementById('emptyCart'); //empty cart btn
    const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
    const totalPriceElement = document.getElementById('totalPrice');


    let books = [];
    let cartItems = [];

    //Fetch books from API
    fetch('https://striveschool-api.herokuapp.com/books')
        .then(response => response.json())
        .then(data => {
            books = data;
            renderBooks(books);
        });

    //Render books
    function renderBooks(bookArray) {
        bookList.innerHTML = '';
        bookArray.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'col-sm-6 col-md-3 col-lg-2';
            bookCard.innerHTML = `
                <div class="card">
                    <img src="${book.img}" class="card-img-top" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">${book.price.toFixed(2)}€</p>
                        <p class="card-text"><small class="text-muted">Book Code: ${book.asin}</small></p>
                        <button class="btn add-to-cart">Add to Cart</button>
                        <button class="btn skip-book">Skip</button>
                        <br><a href="details.html?id=${book.asin}" target="_blank">More details</a>
                    </div>
                </div>
            `;
            bookList.appendChild(bookCard); //insert card

            bookCard.querySelector('.add-to-cart').addEventListener('click', () => {
                addToCart(book);
                bookCard.querySelector('.card').classList.add('card-added');
            });

            bookCard.querySelector('.skip-book').addEventListener('click', () => {
                bookCard.style.display = 'none';  //book display none
            });
        });
    }

    //Add book to cart
    function addToCart(book) {
        cartItems.push(book);  //insert book into cart array
        renderCart();
        cartOffcanvas.show();  //show offcanvas
    }

    //Render cart
    function renderCart() {
        cart.innerHTML = '';
        cartItems.forEach((item, index) => {
            const cartItem = document.createElement('li');
            cartItem.className = 'list-group-item';
            cartItem.innerHTML = `
                <button class="btn btn-sm remove-from-cart"><i class="bi bi-trash"></i></button>
                <div>
                <p>${item.title}<p>
                <p>${item.price.toFixed(2)}€</p>
                </div>
            `;
            cart.appendChild(cartItem);  //add cart item

            cartItem.querySelector('.remove-from-cart').addEventListener('click', () => {
                removeFromCart(index);  //remove cart item
            });
        });

        updateTotalPrice();  //function to calculate total price

    }

    // Remove book from cart
    function removeFromCart(index) {   //element position as parameter
        cartItems.splice(index, 1); //remove element at index position
        renderCart();  
    }

    //Empty cart
    emptyCartButton.addEventListener('click', () => {
        cartItems = [];  //empty array
        renderCart();
    });

    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchText));
        
        if (filteredBooks.length > 0) {
            renderBooks(filteredBooks);
        } else {
            bookList.innerHTML = '<p>No results</p>';
        }
    });

    // Update total price
    function updateTotalPrice() {
        let totalPrice = 0;
        let l = cartItems.length
        for (let i = 0; i < l; i++) {
            totalPrice += cartItems[i].price;  //add price to total
        }
        totalPriceElement.textContent = `${totalPrice.toFixed(2)}€`;
    }

});

