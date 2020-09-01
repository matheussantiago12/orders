import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import { Delete, Visibility } from '@material-ui/icons';
import { Table } from '../../styles/global';
import { Button } from '@material-ui/core';
import api from '../../services/api';

const useStyles = makeStyles(theme => ({
    table: {
      minWidth: 650,
    },
    submit: {
        margin: theme.spacing(2, 0, 5),
    },
}));

const initialValues = {
    sku: '',
    title: '',
    price: '',
    discount: '',
};

const validationSchema = Yup.object({
    sku: Yup.string().required('Este campo é obrigatório'),
    title: Yup.string().required('Este campo é obrigatório'),
    price: Yup.number().required('Este campo é obrigatório').min(0, 'O preço mínimo é de R$ 0,00'),
    discount: Yup.number().min(0, 'Insira um número positivo').max(100, 'O desconto máximo é 100%'),
});

const Products = () => {
    const classes = useStyles();

    const [products, setProducts] = useState([]);
    
    const fetchProducts = async () => {
        await api.get('/products')
            .then(response => {
                setProducts(response.data);
            }).catch(error => {
                alert(`Erro: ${error}`);
            });
    };

    const handleSubmit = async ({ sku, title, price, discount }, { setSubmitting, resetForm }) => {
        await api.post('/products', { sku, title, price, discount })
            .then(response => {
                setProducts([...products, response.data]);
            }).catch(error => {
                alert(`Erro: ${error}`);
            });

        setSubmitting(false);
        resetForm();
    };

    const deleteProduct = async (id) => {
        const result = window.confirm('Você tem certeza que deseja este produto?');
        if (result) {
            await api.delete(`/products/${id}`, {})
                .then(response => {
                    alert('Produto removido com sucesso')
                    setProducts(products.filter(product => product._id !== id));
                }).catch(error => {
                    alert(`Erro: ${error}`);
                });
        }
    };
    
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Field
                            name='sku'
                            label='SKU'
                            type='text'
                            margin='normal'
                            variant='outlined'
                            required
                            fullWidth
                            component={TextField}
                        />
                        <Field
                            name='title'
                            label='Nome'
                            type='text'
                            component={TextField}
                            margin='normal'
                            variant='outlined'
                            fullWidth
                            required
                        />
                        <Field
                            name='price'
                            label='Preço do produto'
                            type='number'
                            component={TextField}
                            margin='normal'
                            variant='outlined'
                            required
                            fullWidth
                        />
                        <Field
                            name='discount'
                            label='Desconto (%)'
                            type='number'
                            component={TextField}
                            margin='normal'
                            variant='outlined'
                            fullWidth
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
                            Enviar
                        </Button>
                    </Form>
                )}
            </Formik>
            <Table>
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Título</th>
                        <th>Preço</th>
                        <th>Desconto</th>
                        <th>Preço após desconto</th>
                        <th className='action'></th>
                        <th className='action'></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.sku}</td>
                            <td>{product.title}</td>
                            <td>R$ {product.price.toFixed(2)}</td>
                            <td>{product.discount}%</td>
                            <td>R$ {(product.price - (product.price / 100 * product.discount)).toFixed(2)}</td>
                            <td 
                                className='action' 
                                onClick={() => deleteProduct(product._id)}
                            >
                                <Delete fontSize='small' />
                            </td>
                            <td className='action'>
                                <Link to={`/produtos/${product._id}`}>
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

export default Products;
