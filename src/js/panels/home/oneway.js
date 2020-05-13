import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";

import {goBack, openPopout, closePopout, openModal, setPage} from "../../store/router/actions";
import * as VK from '../../services/VK';

import {renderGroupsList} from '../../services/renderers';

import {
    Div,
    List,
    Panel,
    Group,
    Button,
    PanelHeader,
    PanelSpinner,
    PanelHeaderBack,
    Header, Select,
    FormLayout, FormLayoutGroup, Input, Checkbox, Alert
} from "@vkontakte/vkui";
import {setFormData} from "../../store/formData/actions";

class HomePanelTrain extends React.Component {

    constructor(props) {
        super(props);

        let DefaultLevelData = {
            level: -1,
            type: -1,
        };
        let DefaultInputlData = {
            text: "",
            userFunc: "",
        };

        this.state = {
            levelData: props.inputData['Settings'] || DefaultLevelData,
            inputData: DefaultInputlData,
            disallowText: false,
        };

        this.handleInput = (e) => {
            let value = e.currentTarget.value ||-1;
            console.log("Выбор - " + value);
            /* if (e.currentTarget.type === 'checkbox') {
                 value = e.currentTarget.checked;
             }*/
            this.setState({
                inputData: {
                    ...this.state.inputData,
                    [e.currentTarget.name]: value
                }
            })
        };

        this.clearForm = () => {
            this.setState({
                inputData: DefaultLevelData
            });
        };
        this.confirmInput = this.confirmInput.bind(this);
    }
    componentDidMount() {
        let trainType;
        switch(this.state.levelData.type)
        {
            case "1": trainType='"Обратные" функции'; break;
            default: trainType="Ошибка"; break;
        }
        this.setState({
            trainType: trainType
        });
       /* this.setState({
            inputData: this.props.formData
        });*/
       // this.props.setFormData('Settings', this.state.inputData);
        console.log(this.state.levelData);
       // console.log( this.props.inputData['Settings']);
    }
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
                    action: this.props.goBack
                }]}
                onClose={() => this.props.closePopout()}
            >
                <h2>Подтвердите действие</h2>
                <p>Вы действительно хотите завершить упражнение?</p>
            </Alert>
        );
    }
    commitTrain()
    {
        if (this.state.inputData.type===-1 || this.state.inputData.level===-1)
            this.openPopout(); else this.props.setPage('home', 'oneway');
    }
    confirmExit()
    {
        this.openPopout()
    }
    confirmInput()
    {
        this.setState({disallowText:true});
    }
    render() {
        const {id, setPage, goBack} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={() => this.confirmExit()}/>}
                >
                    {this.state.trainType}
                </PanelHeader>
                <Div>
                    <Group>
                    <Input value={this.state.inputData.text}
                           onChange={this.handleInput}
                           name="text"
                           placeholder="Текст для шифровки"
                           disabled={this.state.disallowText}
                           autoComplete="off"/>
                        <Button size="l" stretched={true} onClick={this.confirmInput}>Подтвердить</Button>
                    </Group>
                    <Group>
                    <Input value={this.state.inputData.workposition}
                           onChange={this.handleInput}
                           name="workposition"
                           placeholder="Должность"
                           autoComplete="off"/>
                    </Group>
                </Div>
            </Panel>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        inputData: state.formData.forms,
    };
};

const mapDispatchToProps = {
    setFormData,
    goBack,
    setPage,
    openPopout,
    closePopout,
    openModal
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePanelTrain);
