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


    render() {
        const {id, setPage, withoutEpic} = this.props;

        return (

            <Panel id={id} className="PanelBase">
                <div className='alignmentDiv'>
                <Div>
                    <h1 className='appName'>МАТЕМАТИЧЕСКИЙ ТРЕНАЖЁР</h1>
                    <Text weight="medium" className='textstart'>
                        Тренировка в расшифровке текстов, зашифрованных различными алгоритмами шифрования
                    </Text>
                </Div>
                <Group>
                    <Div className="divbutt">
                        <Button mode="secondary" size="l"  className="startbutt"  onClick={() => setPage('home', 'train')}>Начать</Button>

                        <Button mode="secondary" size="l"  className="startbutt"  onClick={() => setPage('home', 'education')}>Обучение</Button>
                    </Div>
                </Group>
                </div>
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
