document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const petSearch = document.getElementById('pet-search');
    const searchBtn = document.querySelector('.search-btn');
    
    searchBtn.addEventListener('click', function() {
        performSearch();
    });
    
    petSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = petSearch.value.trim();
        if (searchTerm) {
            window.location.href = `/search?q=${encodeURIComponent(searchTerm)}&category=pet`;
        }
    }
    
    // Filter functionality
    const sortBy = document.getElementById('sort-by');
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    const petType = document.getElementById('pet-type');
    
    [sortBy, minPrice, maxPrice, petType].forEach(element => {
        element.addEventListener('change', applyFilters);
    });
    
    function applyFilters() {
        const params = new URLSearchParams();
        
        if (sortBy.value !== 'default') {
            params.append('sort', sortBy.value);
        }
        
        if (minPrice.value) {
            params.append('min_price', minPrice.value);
        }
        
        if (maxPrice.value) {
            params.append('max_price', maxPrice.value);
        }
        
        if (petType.value !== 'all') {
            params.append('pet_type', petType.value);
        }
        
        // Reload page with new filters
        window.location.search = params.toString();
    }
    
    // Brand filter
    const brands = document.querySelectorAll('.brand');
    brands.forEach(brand => {
        brand.addEventListener('click', function() {
            const brandId = this.getAttribute('data-brand-id');
            window.location.href = `/pets?brand=${brandId}`;
        });
    });
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
    
    function addToCart(productId) {
        fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showToast('商品已加入購物車');
                updateCartCount(data.cart_count);
            } else {
                showToast('添加失敗: ' + data.message, true);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('發生錯誤', true);
        });
    }
    
    // Helper functions
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'error' : 'success'}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    function updateCartCount(count) {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(el => {
            el.textContent = count;
        });
    }
    
    // Price filter validation
    minPrice.addEventListener('blur', validatePrice);
    maxPrice.addEventListener('blur', validatePrice);
    
    function validatePrice() {
        if (minPrice.value && maxPrice.value && parseFloat(minPrice.value) > parseFloat(maxPrice.value)) {
            showToast('最低價格不能高於最高價格', true);
            this.value = '';
        }
    }
});