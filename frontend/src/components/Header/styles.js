import styled from 'styled-components';

export const Container = styled.div`
    height: 60px;
    width: 100%;
    color: white;
    background-color: rgb(40, 45, 65);
    padding: 20px;
    margin-bottom: 45px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    nav {
        a {
            text-decoration: none;
            color: white;
            padding: 10px;

            &:hover {
                color: #DDD;
            }
        }
    }
`;
