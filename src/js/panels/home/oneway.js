import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";

import {goBack, openPopout, closePopout, openModal, setPage} from "../../store/router/actions";
import * as VK from '../../services/VK';

import {renderGroupsList} from '../../services/renderers';

import Icon28RefreshOutline from '@vkontakte/icons/dist/28/refresh_outline';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon16Done from '@vkontakte/icons/dist/16/done';

import bridge from '@vkontakte/vk-bridge';

import './home.css';

import {
    Div,
    List,
    Panel,
    Group,
    Button,
    PanelHeader,
    Cell,
    InfoRow,
    SimpleCell,
    PanelHeaderBack,
    PanelHeaderContext,
    PanelHeaderContent,
    Input, Alert,
    Snackbar, Avatar
} from "@vkontakte/vkui";
import {setFormData} from "../../store/formData/actions";

class HomePanelTrain extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            contextOpened: false,
            mode: 'all',
            numberOfDone: 0,
            showDecode: false,
            Coded: "",
            color: "red",
            Decode: "",
            StorageLevel: 0,
        };
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
        this.toggleContext = this.toggleContext.bind(this);
        this.getRandomInt = this.getRandomInt.bind(this);
        this.makeCipher=this.makeCipher.bind(this);
    }
    toggleContext () {
        this.setState({ contextOpened: !this.state.contextOpened });
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
            itog: "",
            numberOfDone: 0,
        });
        bridge.subscribe((event) => {
            switch (event.detail.type) {
                case 'VKWebAppStorageSetResult':
                    break;
                case 'VKWebAppStorageGetResult':
                    this.setState({StorageLevel: event.detail.data.keys[0].value});
                    break;
                case 'VKWebAppStorageGetFailed':
                    this.setState({StorageLevel: ""});
                    break;
                default: console.log(event.detail.type);
                    break;
            }
            console.log('new message', event.detail.data);
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
    rightAnswer() {
        this.props.openPopout(
            <Snackbar
                layout="vertical"
                onClose={() => this.props.closePopout()}
                before={<Avatar size={24} style={{background: "blue"}}><Icon16Done fill="#fff" width={14} height={14} /></Avatar>}
            >
                Правильный ответ! Было зашифровано: {this.state.Coded}
            </Snackbar>
        );
        this.makeCipher();
    }
    getRandomInt (max) {
        return Math.floor(Math.random() * Math.floor(max));
    };
    makeCipher()
    {
        this.setState({inputData: {answer: ""}, showDecode: false})
        let text=["привет", "сообщение", "салют", "пончик", "клуб", "алгоритм", "тетрадь", "танцор", "коробка", "гараж", "задание",
        "массив", "тостер", "бутерброд", "полка", "шкаф", "рубашка", "монитор", "картинка", "доступ", "шифр", "пакет", "самокат",
        "песня", "игрушка", "приложение", "голубь", "кот", "собака", "ветер", "снег", "дерево", "перчатка", "книга", "чехол", "чемодан",
        "инструкция", "расписание", "данные", "зеркало", "распутье", "гнездп", "йод", "скотч", "господин", "история", "деньги", "смех",
        "забота", "напиток", "вода", "жизнь", "шкатулка", "булочка", "ручка", "шапка", "лохмотья", "очередь", "крем", "уход", "гонка",
        "скорость", "реакция", "секрет", "рейтинг", "телефон", "посылка", "задумка", "идея", "исполитель", "каникулы", "провод", "наклейка"]; //6 7 5
        let message=text[this.getRandomInt(73)];
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
        this.setState({Message:itog, contextOpened: false, Coded: message});
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
        if (decoded==this.state.Coded) {
            this.setState({
                Decode: decoded,
                showDecode: true,
                color: "green",
                numberOfDone: this.state.numberOfDone + 1
            });
            this.rightAnswer();
        }
        else this.setState({Decode:decoded, showDecode: true, color: "red"});
    }
    render() {
        const {id, setPage, goBack} = this.props;

        return (
            <Panel id={id}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={() => this.confirmExit()}/>}
                >
                    <PanelHeaderContent
                        aside={<Icon16Dropdown style={{ transform: `rotate(${this.state.contextOpened ? '180deg' : '0'})` }} />}
                        onClick={this.toggleContext}
                    >
                    {this.state.trainType}
                    </PanelHeaderContent>
                </PanelHeader>
                <PanelHeaderContext  opened={this.state.contextOpened} onClose={this.toggleContext}>
                    <List>
                        <Cell
                            before={<Icon28RefreshOutline />}
                            onClick={this.makeCipher}
                            data-mode="all"
                        >
                            Обновить задачу
                        </Cell>
                        <Cell
                            data-mode="rightAns"
                        >
                            Количество верных ответов: {this.state.numberOfDone}
                        </Cell>
                    </List>
                </PanelHeaderContext>
                <Group>
                    <SimpleCell>
                    <InfoRow header="Зашифрованное сообщение:">
                         <b>{this.state.Message}</b>
                    </InfoRow>
                    </SimpleCell>
                    {this.state.showDecode &&
                    <SimpleCell style={{background: this.state.color}}>
                        <InfoRow header="Сообщение после применения функции:">
                            <b>{this.state.Decode}</b>
                        </InfoRow>
                    </SimpleCell>
                    }
                    <Div>
                    <InfoRow header="Задача">
                        Ваша задача - ввести функцю, применив которую к каждому символу, можно получить зашифрованное сообщение.
                        В качестве "буквы" используйте <b>x</b>, а для возведения в степень <b>**</b> Пример ввода: <b>(x**2+1)%5</b>
                    </InfoRow>
                    </Div>
                <SimpleCell>
                    <InfoRow header="Функция по которой шифровали:">
                        <b>{this.state.CipherFunc} </b>
                    </InfoRow>
                </SimpleCell>
                </Group>
                <Group>
                <Div>
                    <Input value={this.state.inputData.answer}
                           pattern="[+]7\s[\(]\d{3}[\)]\s\d{3}[\-]\d{2}[\-]\d{2}"
                           onChange={this.handleInput}
                           name="answer"
                           placeholder="Ваш ответ"
                           autoComplete="off"/>
                </Div>
                    <Div>
                    <Button size="l" stretched={true} onClick={this.confirmInput}>Применить функцию</Button>
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
