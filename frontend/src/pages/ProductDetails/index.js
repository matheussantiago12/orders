import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import { Formik, Field, Form } from 'formik';
import { TextField, RadioGroup } from 'formik-material-ui';
import { Button, MenuItem, FormControlLabel, Radio } from '@material-ui/core';
import api from '../../services/api';

const useStyles = makeStyles(theme => ({
    submit: {
        margin: theme.spacing(2, 0, 5),
    },
}));

const validationSchema = Yup.object({
    sku: Yup.string().required('Este campo é obrigatório'),
    title: Yup.string().required('Este campo é obrigatório'),
    price: Yup.number().required('Este campo é obrigatório').min(0, 'O preço mínimo é de R$ 0,00'),
    discount: Yup.number().min(0, 'Insira um número positivo').max(100, 'O desconto máximo é 100%'),
});

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [sku, setSku] = useState();
    const history = useHistory();
    const classes = useStyles();

    const fetchProduct = async () => {
        await api.get(`/products/${id}`)
            .then(response => {
                setProduct(response.data);
            }).catch(error => {
                alert(`Erro: ${error}`);
            });
    };

    const handleSubmit = async ({ sku, title, price, discount }, { setSubmitting, resetForm }) => {
        await api.put(`/products/${id}`, {
            sku,
            title,
            price,
            discount,
        }).then(response => {
            history.push('/produtos');
        }).catch(error => {
            alert(`Erro: ${error}`)
        });
    };

    useEffect(() => {
        fetchProduct();
    }, []);
    
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{ sku: product.sku, title: product.title, price: product.price, discount: product.discount }}
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
        </>
    );
};

export default ProductDetails;
