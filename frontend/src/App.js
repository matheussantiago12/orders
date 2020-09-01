import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@material-ui/core';
import Header from './components/Header';
import routes from './routes';
import GlobalStyle from './styles/global';

const App = () => {
  return (
    <> 
      <BrowserRouter>
      <GlobalStyle />
      <Header />
      <CssBaseline />
      <Container maxWidth='md'>
        <Switch>
          {routes.map(route => (
            <Route 
            path={route.path} 
            component={route.component} 
            exact={route.exact}
            key={route.key}
            />
            ))}
        </Switch>
      </Container>
      </BrowserRouter>
    </>
  );
}

export default App;
