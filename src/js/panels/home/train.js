import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";

import {goBack, openPopout, closePopout, openModal} from "../../store/router/actions";
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
    FormLayout, FormLayoutGroup, Input, Checkbox
} from "@vkontakte/vkui";
import {setFormData} from "../../store/formData/actions";

class HomePanelTrain extends React.Component {

    constructor(props) {
        super(props);

        let defaultInputData = {
            level: -1,
            type: -1,
        };

        this.state = {
            inputData: props.inputData['Settings'] || defaultInputData
        };

        this.handleInput = (e) => {
            let value = e.currentTarget.value;
            console.log("Выбор - " + e.currentTarget.value);
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
                inputData: defaultInputData
            });
        };
    }

    componentWillUnmount() {
        this.props.setFormData('Settings', this.state.inputData);
    }

    render() {
        const {id, goBack} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Выбор уровня
                </PanelHeader>
                <Group>
                    <FormLayout>
                        <FormLayoutGroup top="Уровень сложности">
                            <Select placeholder="Выберите уровень"
                                    onChange={this.handleInput}
                                    name="level"
                                    value={this.state.inputData.level}
                            >
                                <option value="0">Тренировка</option>
                                <option value="1">Легко</option>
                                <option value="2">Средне</option>
                                <option value="3">Сложно</option>
                            </Select>
                            <Select placeholder="Выберите уровень"
                                    onChange={this.handleInput}
                                    name="type"
                                    value={this.state.inputData.type}
                            >
                                <option value="1">Обратные функции</option>
                            </Select>
                        </FormLayoutGroup>
                    </FormLayout>
                    <Div className="buttons-group">
                        <Button size="l" stretched={true} onClick={() => goBack()}>Сохранить</Button>
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
    goBack
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePanelTrain);
