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
            answer: "",
        };

        this.state = {
            levelData: props.inputData['Settings'] || DefaultLevelData,
            inputData: DefaultInputlData,
            disallowText: false,
        };

        this.handleInput = (e) => {
            let value = e.currentTarget.value;

            //console.log("Выбор - " + value);
            /* if (e.currentTarget.type === 'checkbox') {
                 value = e.currentTarget.checked;
             }*/
            // if ((value[value.length-1]>'a' && value[value.length-1]<'z') && value[value.length-1]!='x')
            value=value.replace(/[A-WY-Za-wy-zА-Яа-яЁё]/, '');
                console.log(value);
            this.setState({
                inputData: {
                    ...this.state.inputData,
                    [e.currentTarget.name]: value
                }
            })
        };

        this.clearForm = () => {
            this.setState({
                inputData: DefaultInputlData
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
            trainType: trainType,
            itog: ""
        });
        this.makeCipher();
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
    wrongInput() {
        this.props.openPopout(
            <Alert
                onClose={() => this.props.closePopout()}
            >
                <h2>Вы не ввели x!</h2>
            </Alert>
        );
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    makeCipher()
    {
        let text=["всем привет", "тестовое сообщение", "второе сообщение"];
        let message=text[this.getRandomInt(3)];
        var itog="";
        switch(this.state.levelData.level)
        {
            case "0":
                let cons0=this.getRandomInt(10)+1;
                for (let i=0;i<message.length;i++)
                    itog+=String.fromCodePoint(message.charCodeAt(i)+cons0);
                this.setState({CipherFunc: "x+"+cons0});
                break;
            case "1":
                let cons1=this.getRandomInt(100)+1;
                let module=this.getRandomInt(20)+33;
                for (let i=0;i<message.length;i++)
                    itog+=String.fromCodePoint(1072+Number(message.charCodeAt(i)+cons1)%module);
                this.setState({CipherFunc: "(x+"+cons1+")%"+module});
                break;
            case "2":
                let cons2=this.getRandomInt(20)+1;
                let module2=this.getRandomInt(20)+33;
                for (let i=0;i<message.length;i++)
                    itog+=String.fromCodePoint(1072+Number(message.charCodeAt(i)*cons2)%module2);
                this.setState({CipherFunc: "(x*"+cons2+")%"+module2});
                break;
            case "3":
                let cons3=this.getRandomInt(10)+1;
                let module3=this.getRandomInt(20)+33;
                for (let i=0;i<message.length;i++)
                    itog+=String.fromCodePoint(1072+Number(message.charCodeAt(i)**cons3)%module3);
                this.setState({CipherFunc: "(x**"+cons3+")%"+module3});
                break;
            default: itog="Ошибка"
        }
        this.setState({Message:itog});
    }
    confirmExit()
    {
        this.openPopout()
    }
    confirmInput()
    {
        if (this.state.inputData.answer.indexOf('x')==-1) {this.wrongInput(); return;}
        let decoded="";
       // console.log(this.state.inputData.answer.indexOf('%')!=-1);
     //  console.log(eval(this.state.inputData.answer.substr(0, this.state.inputData.answer.indexOf('x'))+this.state.Message.charCodeAt(5)+this.state.inputData.answer.substr(this.state.inputData.answer.indexOf('x') + 1, this.state.inputData.answer.length - 1)));
        for (let i=0;i<this.state.Message.length;i++) {
            if (this.state.inputData.answer.indexOf('%')!=-1)
                decoded+=String.fromCharCode(1072+eval(this.state.inputData.answer.substr(0, this.state.inputData.answer.indexOf('x'))+(this.state.Message.charCodeAt(i)-1072)+this.state.inputData.answer.substr(this.state.inputData.answer.indexOf('x') + 1, this.state.inputData.answer.length - 1)));
                else
            decoded+=String.fromCharCode(eval(this.state.inputData.answer.substr(0, this.state.inputData.answer.indexOf('x'))+this.state.Message.charCodeAt(i)+this.state.inputData.answer.substr(this.state.inputData.answer.indexOf('x') + 1, this.state.inputData.answer.length - 1)));
        }

        console.log(decoded);
        this.setState({Decode:decoded});
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
                    Зашифрованное сообщение: <b>{this.state.Message}</b>
                </Div>
                <Div>
                    Ваша задача - ввести функцю, применив которую к каждому символу, можно получить зашифрованное сообщение.
                    В качестве "буквы" используйте <b>x</b>, а для возведения в степень <b>**</b> Пример ввода: <b>(x**2+1)%5</b>
                </Div>
                Функция по которой шифровали: {this.state.CipherFunc}
                <Div>
                    <Input value={this.state.inputData.answer}
                           pattern="[+]7\s[\(]\d{3}[\)]\s\d{3}[\-]\d{2}[\-]\d{2}"
                           onChange={this.handleInput}
                           name="answer"
                           placeholder="Ваш ответ"
                           autoComplete="off"/>
                           <Button size="l" stretched={true} onClick={this.confirmInput}>Подтвердить</Button>
                </Div>
                <Div>
                    {this.state.Decode}
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
