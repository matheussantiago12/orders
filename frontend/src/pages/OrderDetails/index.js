import React, { useEffect, useState } from 'react';
import { OrderFieldCard } from './styles';
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
    description: Yup.string().required('Este campo é obrigatório'),
});

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState({ items: [] });
    const [situation, setSituation] = useState(0);
    const [description, setDescription] = useState('');
    const history = useHistory();
    const classes = useStyles();

    const fetchOrder = async () => {
        await api.get(`/orders/${id}`)
            .then(response => {
                setOrder(response.data);
                setSituation(response.data.situation);
                setDescription(response.data.description);
            }).catch(error => {
                alert(`Erro: ${error}`);
            });
    };

    const handleSubmit = async ({ description, situation }, { setSubmitting, resetForm }) => {
        await api.put(`/orders/${id}`, {
            description,
            situation,
        }).then(response => {
            history.push('/pedidos');
        }).catch(error => {
            alert(`Erro: ${error}`)
        });
    };

    useEffect(() => {
        fetchOrder();
    }, []);
    
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={{ description, situation }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <Field
                            name='description'
                            label='Descrição do pedido'
                            type='text'
                            margin='normal'
                            variant='filled'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            fullWidth
                            component={TextField}
                        />
                        <OrderFieldCard>
                            <p><strong>Itens:</strong></p>
                            {order.items?.map(item => (
                                <p>{item.product.sku} - {item.product.title} x {item.quantity} = R$ {((item.product.price - (item.product.price / 100 * item.product.discount)) * item.quantity).toFixed(2)}</p>
                            ))}
                        </OrderFieldCard>
                        <OrderFieldCard>
                            <p><strong>Data:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        </OrderFieldCard>
                        <Field component={RadioGroup} 
                            name='situation' 
                            value={situation} 
                            onChange={(e) => setSituation(e.target.value)}
                        >
                            <FormControlLabel
                                value='0'
                                control={<Radio disabled={isSubmitting} />}
                                label='Em análise'
                                disabled={isSubmitting}
                            />
                            <FormControlLabel
                                value='1'
                                control={<Radio disabled={isSubmitting} />}
                                label='Aprovado'
                                disabled={isSubmitting}
                            />
                            <FormControlLabel
                                value='2'
                                control={<Radio disabled={isSubmitting} />}
                                label='Cancelado'
                                disabled={isSubmitting}
                            />
                        </Field>
                        <OrderFieldCard>
                            <p><strong>Subtotal</strong>: R${order.totalValue?.toFixed(2)}</p>
                        </OrderFieldCard>
                        <Button
                            type='submit'
                            variant='contained'
                            color='secondary'
                            fullWidth
                            disabled={isSubmitting}
                            className={classes.submit}
                        >
                            Salvar pedido
                        </Button>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default OrderDetails;
