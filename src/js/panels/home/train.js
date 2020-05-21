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
            alpha: -1,
        };

        this.state = {
            inputData: props.inputData['Settings'] || DefaultLevelData
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
    }

    componentWillUnmount() {
        this.props.setFormData('Settings', this.state.inputData);
    }
    openPopout() {
        this.props.openPopout(
            <Alert
                actions={[{
                    title: 'ок',
                    autoclose: true,
                }]}
                onClose={() => this.props.closePopout()}
            >
                <h2>Ошибка</h2>
                <p>Заполните все поля</p>
            </Alert>
        );
    }
    commitTrain()
    {
        if (this.state.inputData.type===-1 || this.state.inputData.level===-1)
            this.openPopout();
        else {
            this.props.setFormData('Settings', this.state.inputData);
            this.props.setPage('home', 'oneway');
            }
    }
    render() {
        const {id, setPage, goBack} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                   Выбор упражнения
                </PanelHeader>
                <Div>
                </Div>
                <Group>
                    <FormLayout>
                        <FormLayoutGroup top="Уровень сложности">
                            <Select placeholder="Выберите уровень"
                                    onChange={this.handleInput}
                                    name="level"
                                    value={this.state.inputData.level}
                            >
                                <option value="0" title={"Простешее упражнение для знакомства с интерфейсом"}>Тренировка</option>
                                <option value="1" title={"Сдвиг и взятие по модулю"}>Легко</option>
                                <option value="2" title={"Умножение и взятие по модулю"}>Средне</option>
                                <option value="3" title={"Возведение в степень и взятие по модулю"}>Сложно</option>
                            </Select>
                            <Select placeholder="Выберите упражнение"
                                    onChange={this.handleInput}
                                    name="type"
                                    value={this.state.inputData.type}
                            >
                                <option value="1">Обратные функции</option>
                            </Select>
                        </FormLayoutGroup>
                    </FormLayout>
                    <Div className="buttons-group">
                        <Button size="l" stretched={true} onClick={() => this.commitTrain()}>Перейти к выполнению</Button>
                        <Button size="l" stretched={true} onClick={this.clearForm}>Очистить</Button>
                    </Div>
                </Group>
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
