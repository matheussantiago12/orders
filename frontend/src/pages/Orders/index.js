import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import { Table } from '../../styles/global';
import { Button, MenuItem } from '@material-ui/core';
import { Delete, Visibility } from '@material-ui/icons';
import api from '../../services/api';

const useStyles = makeStyles(theme => ({
    submit: {
        margin: theme.spacing(2, 0, 5),
    },
    addItem: {
        margin: theme.spacing(2, 0, 2),
    },
    actionIcons: {
        width: 20,
        height: 20,
    },
}));

const itemsInitialValues = {
    product: '',
    quantity: '',
};

const itemsValidationSchema = Yup.object({
    product: Yup.string().required('Este campo é obrigatório'),
    quantity: Yup.number()
        .required('Este campo é obrigatório')
        .min(1, 'A quantidade mínima é 1')
        .integer('Por favor, insira um número inteiro!'),
});

const ordersInitialValues = {
    description: '',
};

const ordersValidationSchema = Yup.object({
    description: Yup.string().required('Este campo é obrigatório'),
});

const Orders = () => {
    const [availableProducts, setAvailableProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const classes = useStyles();

    const fetchProducts = async () => {
        await api.get('/products')
            .then(response => {
                setAvailableProducts(response.data);
            }).catch(error => {
                alert(`Erro: ${error}`);
            });
    };

    const fetchOrders = async () => {
        await api.get('/orders')
            .then(response => {
                setOrders(response.data);
            }).catch(error => {
                alert(`Erro: ${error}`);
            });
    };

    const handleItemSubmit = ({ product, quantity }, { setSubmitting, resetForm }) => {
        setItems([...items, { product, quantity }]);
        setSubmitting(false);
        resetForm();
    };

    const handleOrderSubmit = async ({ description }, { setSubmitting, resetForm }) => {
        let itemsIds = [];

        const saveItem = async (item) => {
            await api.post('/items', {
                product: item.product._id,
                quantity: item.quantity,
            }).then(response => {
                itemsIds = [...itemsIds, response.data._id];
            }).catch(error => {
                alert(`Erro: ${error}`);
            });
        };

        await Promise.all(items.map(async item => {
            await saveItem(item);
        }));

        await api.post('/orders', {
            items: itemsIds,
            description,
        }).then(response => {
            setOrders([...orders, response.data]);
        });

        setItems([]);
        setSubtotal(0);
        setSubmitting(false);
        resetForm();
    };

    const handleSituation = (idx) => {
        const situation = ['Em análise', 'Aprovado', 'Cancelado'];

        return situation[idx];
    };

    const deleteOrder = async (id) => {
        const result = window.confirm('Você tem certeza que deseja este pedido?');
        if (result) {
            await api.delete(`/orders/${id}`, {})
                .then(response => {
                    alert('Pedido removido com sucesso')
                    setOrders(orders.filter(order => order._id !== id));
                }).catch(error => {
                    alert(`Erro: ${error}`);
                });
        }
    };

    useEffect(() => {
        const results = availableProducts.filter((product) => !items.some((item) => item.product._id === product._id));
        setAvailableProducts(results);
        items.map(item => {
            setSubtotal(subtotal + ((item.product.price - (item.product.price / 100 * item.product.discount)) * item.quantity));
        });
    }, [items]);

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    return (
        <>
            <Formik
                initialValues={itemsInitialValues}
                validationSchema={itemsValidationSchema}
                onSubmit={handleItemSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Field
                            name='product'
                            label='Produto'
                            type='text'
                            margin='normal'
                            variant='outlined'
                            required
                            fullWidth
                            select={true}
                            component={TextField}
                        >
                            {availableProducts.map(product => (
                                <MenuItem 
                                    key={product._id}
                                    value={product}
                                >
                                    {product.title}
                                </MenuItem>
                            ))}
                        </Field>
                        <Field
                            name='quantity'
                            label='Quantidade'
                            type='number'
                            margin='normal'
                            variant='outlined'
                            required
                            fullWidth
                            component={TextField}
                        />
                        <Button
                            href='' 
                            type='submit'
                            variant='contained'
                            color='secondary'
                            fullWidth
                            disabled={isSubmitting}
                            className={classes.addItem}
                        >
                            Adicionar item
                        </Button>
                    </Form>
                )}
            </Formik>
            {items.map(item => (
                <ul key={item.product.title}>
                    <li>{item.product.title} x {item.quantity} = R$ {((item.product.price - (item.product.price / 100 * item.product.discount)) * item.quantity).toFixed(2)}</li>
                </ul>
            ))}
            {items.length > 0 &&
                <>
                    <hr></hr>
                    <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
                </>
            } 
            <Formik
                initialValues={ordersInitialValues}
                validationSchema={ordersValidationSchema}
                onSubmit={handleOrderSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Field
                            name='description'
                            label='Descrição do pedido'
                            type='text'
                            margin='normal'
                            variant='outlined'
                            required
                            fullWidth
                            component={TextField}
                        />
                        <Button
                            href='' 
                            type='submit'
                            variant='contained'
                            color='secondary'
                            fullWidth
                            disabled={isSubmitting}
                            className={classes.submit}
                        >
                            Finalizar pedido
                        </Button>
                    </Form>
                )}
            </Formik>
            <Table>
                <thead>
                    <tr>
                        <th>Descrição</th>
                        <th>Valor Total</th>
                        <th>Data</th>
                        <th>Situação</th>
                        <th className='action'></th>
                        <th className='action'></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>{order.description}</td>
                            <td>R$ {order.totalValue.toFixed(2)}</td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>{handleSituation(order.situation)}</td>
                            <td 
                                className='action' 
                                onClick={() => deleteOrder(order._id)}
                            >
                                <Delete fontSize='small' />
                            </td>
                            <td className='action'>
                                <Link to={`/pedidos/${order._id}`}>
                                    <Visibility fontSize='small' />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default Orders;
