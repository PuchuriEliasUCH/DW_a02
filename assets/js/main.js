(() => {

    'use strict'

    const $slc_cate = document.querySelector('#categoria'),
        $p_stock = document.querySelector('#stock'),
        $txt_cantidad = document.querySelector('#cantidad'),
        $btn_comprar = document.querySelector('#btn_comprar'),
        $temp_pasajes = document.querySelector('#temp_pasajes'),
        $ventas = document.querySelector('#ventas');

    let num_venta = 1,
        indice = 0,
        venta = {};

    const pasajes = [
        { categoria: "Económico", stock: 40, precio: 50 },
        { categoria: "Semi Cama", stock: 30, precio: 70 },
        { categoria: "Cama", stock: 20, precio: 90 },
        { categoria: "VIP", stock: 10, precio: 120 },
    ];

    const ventas = []

    // Funcionalidad
    const mostrarStock = (categoria) => {
        const stock = pasajes[categoria - 1].stock;
        $p_stock.innerText = `Asientos disponibles: ${stock}`;
    };

    const comprarTickets = () => {
        const cate = $slc_cate.value
        const { categoria, precio } = pasajes[cate - 1]
        const cantidad = $txt_cantidad.value * 1
        const subtotal = precio * cantidad

        let stock = pasajes[cate - 1].stock

        if (
            isNaN(cantidad) || cantidad <= 0 || cantidad > stock
        ) {
            alert("Por favor, ingrese una cantidad válida.");
            return;
        }


        if (confirm("Confirmar pedido")) {
            pasajes[cate - 1].stock -= cantidad;

            const descuento = (cantidad < 5 ? "Sin Beneficios" : "Descuento del 15%")
            const total = (cantidad < 5 ? subtotal : subtotal * .85)

            venta = {
                id: num_venta,
                indice,
                pasajes: {
                    categoria,
                    precio,
                    cantidad
                },
                subtotal,
                descuento,
                total
            }

            indice++
            ventas.push(venta)

            limpiar()
            if (!confirm("seguir comprando?")) {
                num_venta++
                limpiar();
            }
        } else {
            alert("Compra cancelada")
            limpiar()
        }
    }

    const limpiar = () => {
        $slc_cate.value = 1
        $txt_cantidad.value = 1
        mostrarStock(1)
    }

    // Mostrar ventas
    const mostrarVentas = () => {
        $ventas.innerHTML = ""

        if (ventas.length === 0){
            $ventas.innerHTML = `<h3>Aún no se han registrado ventas</h3>`
        } else {
            $ventas.innerHTML = '';
            ventas.forEach(el => {
                const clone = document.importNode($temp_pasajes.content, true)
                clone.querySelector(".tipo").textContent = `Cliente: ${el.id}`
                clone.querySelector(".pasaje").innerHTML = `<li>Categoria: ${el.pasajes.categoria}</li>
                <li>Precio: S/${el.pasajes.precio}</li>
                <li>N. Boletos: ${el.pasajes.cantidad}</li>
                <li>Beneficios: ${el.descuento}</li>
                <li>Subtotal: ${el.subtotal}</li>
                `;
                clone.querySelector(".total").textContent = `Total: ${el.total}`
                
                const btnEliminar = clone.querySelector(".btn_eliminar");
                btnEliminar.setAttribute('id', el.indice)
                btnEliminar.addEventListener('click', eliminarVenta);

                $ventas.appendChild(clone)
            })
        }
    }
    
    // Eliminar pedido
    const eliminarVenta = (e) => {
        if(confirm("Estas seguro de eliminar la venta?")){
            const index = ventas.findIndex(venta => venta.indice === e.target.id * 1)
            ventas.splice(index, 1)
            mostrarVentas();
        }

    }


    // Eventos
    $slc_cate.addEventListener('change', (e) => {
        mostrarStock(e.target.value);
    });

    $btn_comprar.addEventListener('click', (e) => {
        comprarTickets();
        mostrarVentas();
    })

    // Ejecucion
    limpiar();
    mostrarVentas();

})();