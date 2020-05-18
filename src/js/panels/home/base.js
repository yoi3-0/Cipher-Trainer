import React from 'react';
import {connect} from 'react-redux';

import {closePopout, goBack, openModal, openPopout, setPage} from '../../store/router/actions';

import {Div, Panel, Alert, Group, Button, PanelHeader, Text} from "@vkontakte/vkui"

import Icon24Filter from '@vkontakte/icons/dist/24/filter';

import './home.css';

class HomePanelBase extends React.Component {

    state = {
        showImg: false
    };

    showImg = () => {
        this.setState({showImg: true});
    };

    openPopout() {
        this.props.openPopout(
            <Alert
                actions={[{
                    title: 'Нет',
                    autoclose: true,
                    style: 'cancel',
                }, {
                    title: 'Да',
                    autoclose: true,
                    action: this.showImg
                }]}
                onClose={() => this.props.closePopout()}
            >
                <h2>Вопрос значит</h2>
                <p>Вас роняли в детстве?</p>
            </Alert>
        );
    }

    render() {
        const {id, setPage, withoutEpic} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader>Главная</PanelHeader>
                <Div>
                    <Text weight="medium" className='textstart'>Добро пожаловать в математический тренажёр!<br/>
                    Данное мини-приложение позволяет потренироваться в расшифровке текстов, зашифрованных различными алгоритмами шифрования.
                    </Text>
                </Div>
                <Group>
                    <Div className="divbutt">
                        <Button mode="secondary" size="l"  className="startbutt"  onClick={() => setPage('home', 'train')}>Начать</Button>

                        <Button mode="secondary" size="l"  className="startbutt2"  onClick={() => setPage('home', 'education')}>Обучение</Button>
                    </Div>
                    {this.state.showImg && <Div className="div-center">
                        <img src="https://vk.com/sticker/1-12676-256" alt="Стикер VK"/>
                    </Div>}
                </Group>
            </Panel>
        );
    }

}

const mapDispatchToProps = {
    setPage,
    goBack,
    openPopout,
    closePopout,
    openModal
};

export default connect(null, mapDispatchToProps)(HomePanelBase);
