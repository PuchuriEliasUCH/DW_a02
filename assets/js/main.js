(() => {

    'use strict'

    // Primero, seleccionamos los elementos del DOM que necesitamos para trabajar con ellos
    const $slc_cate = document.querySelector('#categoria'),  // El select donde el usuario elige la categoría
        $p_stock = document.querySelector('#stock'),  // El área donde se muestra el stock de boletos disponibles
        $txt_cantidad = document.querySelector('#cantidad'),  // El campo donde el usuario ingresa la cantidad de boletos
        $btn_comprar = document.querySelector('#btn_comprar'),  // El botón para comprar boletos
        $temp_pasajes = document.querySelector('#temp_pasajes'),  // Plantilla para mostrar los pasajes comprados
        $ventas = document.querySelector('#ventas');  // Área donde se mostrarán las compras

    // Inicializamos algunas variables necesarias para la lógica de ventas
    let num_venta = 1,  // El número de la venta, que se incrementa por cada compra
        indice = 0,  // Índice para rastrear cada venta
        venta = {};  // Objeto que almacenará la información de cada venta

    // Definimos los datos de los boletos disponibles (categoría, stock y precio)
    const pasajes = [
        { categoria: "Económico", stock: 40, precio: 50 },
        { categoria: "Semi Cama", stock: 40, precio: 70 },
        { categoria: "Cama", stock: 40, precio: 90 },
        { categoria: "VIP", stock: 40, precio: 120 },
    ];

    // Aquí almacenamos todas las ventas realizadas
    const ventas = []

    // Función para mostrar la cantidad de asientos disponibles según la categoría seleccionada
    const mostrarStock = (categoria) => {
        const stock = pasajes[categoria - 1].stock;  // Obtenemos el stock de la categoría seleccionada
        $p_stock.innerText = `Asientos disponibles: ${stock}`;  // Mostramos el stock en el HTML
    };

    // Función que se ejecuta cuando el usuario hace clic en el botón de "Comprar Boletos"
    const comprarTickets = () => {
        const cate = $slc_cate.value  // Obtenemos la categoría seleccionada
        const { categoria, precio } = pasajes[cate - 1]  // Obtenemos los datos de la categoría seleccionada
        const cantidad = $txt_cantidad.value * 1  // Obtenemos la cantidad de boletos a comprar
        const subtotal = precio * cantidad  // Calculamos el subtotal (precio * cantidad)

        let stock = pasajes[cate - 1].stock  // Obtenemos el stock disponible para la categoría

        // Verificamos que la cantidad sea válida (mayor que 0 y no supere el stock)
        if (
            isNaN(cantidad) || cantidad <= 0 || cantidad > stock
        ) {
            alert("Por favor, ingrese una cantidad válida.");
            return;
        }

        // Si el usuario confirma la compra, procedemos con la venta
        if (confirm("Confirmar pedido.")) {
            pasajes[cate - 1].stock -= cantidad;  // Restamos la cantidad de boletos vendidos del stock

            // Si compran menos de 5 boletos, no hay descuento, si compran 5 o más, se aplica un 15% de descuento
            const descuento = (cantidad < 5 ? "Sin Beneficios" : "Descuento del 15%")
            const total = (cantidad < 5 ? subtotal : subtotal * .85)  // Calculamos el total con o sin descuento

            // Creamos un objeto de venta con los detalles de la compra
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

            indice++  // Aumentamos el índice para la siguiente venta
            ventas.push(venta)  // Añadimos la venta al array de ventas

            limpiar()  // Limpiamos los campos para que el usuario pueda realizar otra compra
            // Preguntamos si desea seguir comprando, si no, incrementamos el número de venta y limpiamos los campos
            if (!confirm("¿Seguir comprando?")) {
                num_venta++
                limpiar();
            }
        } else {
            alert("Compra cancelada.")  // Si el usuario cancela, mostramos un mensaje
            limpiar()
        }
    }

    // Función para limpiar los campos del formulario después de una compra
    const limpiar = () => {
        $slc_cate.value = 1  // Reiniciamos la categoría a "Económico"
        $txt_cantidad.value = 1  // Reiniciamos la cantidad a 1
        mostrarStock(1)  // Mostramos el stock de la categoría "Económico"
    }

    // Función para mostrar todas las ventas realizadas en la sección de ventas
    const mostrarVentas = () => {
        $ventas.innerHTML = ""  // Limpiamos el área de ventas antes de mostrar las nuevas ventas

        // Si no hay ventas, mostramos un mensaje indicándolo
        if (ventas.length === 0){
            $ventas.innerHTML = `<h3>Aún no se han registrado ventas.</h3>`
        } else {
            $ventas.innerHTML = '';  // Limpiamos la sección de ventas
            ventas.forEach(el => {
                // Creamos una copia del template para cada venta
                const clone = document.importNode($temp_pasajes.content, true)
                clone.querySelector(".tipo").textContent = `Cliente: ${el.id}`  // Mostramos el ID de la venta
                clone.querySelector(".pasaje").innerHTML = `<li>Categoria: ${el.pasajes.categoria}</li>
                <li>Precio: S/${el.pasajes.precio}</li>
                <li>N. Boletos: ${el.pasajes.cantidad}</li>
                <li>Beneficios: ${el.descuento}</li>
                <li>Subtotal: ${el.subtotal}</li>
                `;  // Mostramos los detalles de los boletos comprados
                clone.querySelector(".total").textContent = `Total: ${el.total}`  // Mostramos el total de la compra
                
                const btnEliminar = clone.querySelector(".btn_eliminar");  // Buscamos el botón de eliminar
                btnEliminar.setAttribute('id', el.indice)  // Asignamos el índice de la venta al botón
                btnEliminar.addEventListener('click', eliminarVenta);  // Añadimos el evento para eliminar la venta

                $ventas.appendChild(clone)  // Añadimos la venta a la sección de ventas
            })
        }
    }
    
    // Función para eliminar una venta específica
    const eliminarVenta = (e) => {
        if(confirm("¿Estas seguro de eliminar la venta?")){  // Confirmamos si el usuario está seguro de eliminar
            const index = ventas.findIndex(venta => venta.indice === e.target.id * 1)  // Buscamos la venta por su índice
            ventas.splice(index, 1)  // Eliminamos la venta del array
            mostrarVentas();  // Volvemos a mostrar las ventas actualizadas
        }
    }

    // Eventos
    $slc_cate.addEventListener('change', (e) => {
        mostrarStock(e.target.value);  // Cuando el usuario cambia la categoría, actualizamos el stock
    });

    $btn_comprar.addEventListener('click', (e) => {
        comprarTickets();  // Llamamos a la función de compra cuando se hace clic en el botón
        mostrarVentas();  // Mostramos las ventas después de la compra
    })

    // Ejecución inicial
    limpiar();  // Limpiamos los campos al cargar la página
    mostrarVentas();  // Mostramos las ventas al cargar la página

})();
