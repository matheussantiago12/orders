import React from 'react';
import { Container } from './styles';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <Container>
            <h1>Sistema de pedidos</h1>
            <nav>
                <Link to='/produtos'>
                    Produtos
                </Link>
                <Link to='/pedidos'>
                    Pedidos
                </Link>
            </nav>
        </Container>
    );
};

export default Header;
