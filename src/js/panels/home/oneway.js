import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";

import {goBack, openPopout, closePopout, openModal, setPage} from "../../store/router/actions";
import * as VK from '../../services/VK';

import {renderGroupsList} from '../../services/renderers';

import Icon28RefreshOutline from '@vkontakte/icons/dist/28/refresh_outline';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import Icon24Education from '@vkontakte/icons/dist/24/education';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';

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
    FormLayout,
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
            alphabet: 0,
            helptext: "",
            allowtip: false,
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
            value=value.replace(/[A-WY-Za-wy-zА-Яа-яЁё]/, '').toLowerCase();
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
        this.NOD=this.NOD.bind(this);
        this.showhelp=this.showhelp.bind(this);
    }
    toggleContext () {
        this.setState({ contextOpened: !this.state.contextOpened });
    }

    componentDidMount() {
        let trainType, levelType;
        switch(this.state.levelData.type)
        {
            case "1": trainType='Обратные функции'; break;
            default: trainType="Ошибка"; break;
        }
        switch(this.state.levelData.level)
        {
            case "0": levelType='Тренировка'; break;
            case "1": levelType='Легкий уровень'; break;
            case "2": levelType='Средний уровень'; break;
            case "3": levelType='Тяжёлый уровень'; break;
            default: levelType="Ошибка"; break;
        }
        this.setState({
            trainType: trainType,
            levelType: levelType,
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
    NOD (x, y) {
        if (y > x) return this.NOD(y, x);
        if (!y) return x;
        return this.NOD(y, x % y);
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
        this.setState({inputData: {answer: ""}, showDecode: false, allowtip: false});
        let text=["привет", "сообщение", "салют", "пончик", "клуб", "алгоритм", "тетрадь", "танцор", "коробка", "гараж", "задание",
            "массив", "тостер", "бутерброд", "полка", "шкаф", "рубашка", "монитор", "картинка", "доступ", "шифр", "пакет", "самокат",
            "песня", "игрушка", "приложение", "голубь", "кот", "собака", "ветер", "снег", "дерево", "перчатка", "книга", "чехол", "чемодан",
            "инструкция", "расписание", "данные", "зеркало", "распутье", "гнездо", "йод", "скотч", "господин", "история", "деньги", "смех",
            "забота", "напиток", "вода", "жизнь", "шкатулка", "булочка", "ручка", "шапка", "лохмотья", "очередь", "крем", "уход", "гонка",
            "скорость", "реакция", "секрет", "рейтинг", "телефон", "посылка", "задумка", "идея", "исполнитель", "каникулы", "провод", "наклейка"]; //6 7 5
        let message=text[this.getRandomInt(73)], tip;
        var itog="";
        switch(this.state.levelData.level)
        {
            case "0":
                let cons0=this.getRandomInt(13)+1;
                for (let i=0;i<message.length;i++)
                    itog+=String.fromCodePoint(message.charCodeAt(i)+cons0);
                tip="Здесь мы работаем с простейшим алгоритмом шифрования. Коды всех символов увеличены на "+cons0+". "+"Для расшифровки " +
                    "достаточно просто применить обратную операцию. В данном случае просто вычесть это же число.";
                this.setState({CipherFunc: "x+"+cons0, helptext: tip});
                break;
            case "1":
                let cons1=this.getRandomInt(100)+1;
                let module=this.getRandomInt(20)+33;
                for (let i=0;i<message.length;i++)
                    itog+=String.fromCodePoint(1072+Number((message.charCodeAt(i)-1071)+cons1)%module);
                tip="Очень крутое пояснение решения."
                this.setState({CipherFunc: "(x+"+cons1+")%"+module+"+1", helptext: tip});
                break;
            case "2":
                let cons2=this.getRandomInt(20)+2;
                let module2=this.getRandomInt(20)+33;
                while (this.NOD(cons2,module2)!=1)
                {
                    cons2=this.getRandomInt(20)+1;
                    module2=this.getRandomInt(20)+33;
                }
                for (let i=0;i<message.length;i++)
                    itog+=String.fromCodePoint(1072+Number((message.charCodeAt(i)-1071)*cons2)%module2);
                tip="Очень крутое пояснение решения."
                this.setState({CipherFunc: "(x*"+cons2+")%"+module2+"+1", helptext: tip});
                break;
            case "3":
                let cons3=this.getRandomInt(10)+1;
                let module3=this.getRandomInt(20)+33;
                while (this.NOD(cons3,module3)!=1)
                {
                    cons3=this.getRandomInt(20)+1;
                    module3=this.getRandomInt(20)+33;
                }
                for (let i=0;i<message.length;i++) {
                    itog += String.fromCodePoint(1072 + Number((message.charCodeAt(i)-1071) ** cons3) %module3);
                }
                tip="Очень крутое пояснение решения."
                this.setState({CipherFunc: "(x^"+cons3+")%"+module3+"+1", helptext: tip});
                break;
            default: itog="Ошибка"
        }
        this.setState({Message:itog, contextOpened: false, Coded: message});
    }
    confirmExit()
    {
        this.openPopout()
    }
    confirmInput = (e) =>
    {
        e.preventDefault();
        if (this.state.inputData.answer.indexOf('x')==-1) {this.wrongInput(); return;}
        let decoded="";
        let codeG=this.state.inputData.answer;
       // console.log(this.state.inputData.answer.indexOf('%')!=-1);
     //  console.log(eval(this.state.inputData.answer.substr(0, this.state.inputData.answer.indexOf('x'))+this.state.Message.charCodeAt(5)+this.state.inputData.answer.substr(this.state.inputData.answer.indexOf('x') + 1, this.state.inputData.answer.length - 1)));
        for (let i=0;i<this.state.Message.length;i++) {
                var re = /x/gi;
                var row = /\^/gi;
                let code=(codeG.replace(re,(this.state.Message.charCodeAt(i) - 1071))).replace(row,'**');
                console.log(code);
                let evres=Number(eval(code));
                //if (evres<0)  evres=32+evres;
                decoded += String.fromCharCode(1071 + evres);
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
    showhelp()
    {
        this.setState({allowtip: !this.state.allowtip});
    }
    render() {
        const {id, setPage, goBack} = this.props;

        return (
            <Panel id={id} className='train_one'>
                    <Div className='headercontent'>
                        <Button mode="tertiary" size="l" before={<Icon24BrowserBack/>} onClick={() => this.confirmExit()} className='backButt'>
                            <h2> &nbsp; </h2>
                        </Button>
                        <h2 className='headerH'> <b className='headerOneH'>{this.state.trainType} </b>
                            <br/>                           <b className='traintype'> {this.state.levelType} </b></h2>
                        <List className='headerbut'>
                            <Cell
                                before={<Icon28RefreshOutline width={20} height={20} style={{color:'#141f50'}}/>}
                                onClick={this.makeCipher}
                                data-mode="all"
                            >
                                <b className='refreshbut'>Обновить </b>
                            </Cell>
                            {this.state.levelData.level!=='0'&&  <b className='refreshbut'> Верных ответов: {this.state.numberOfDone}</b> }
                        </List>
                    </Div>
                <Group>
                        <SimpleCell>
                            <InfoRow>
                                <b className='Mosttext'>Зашифрованное сообщение:</b>
                                <div className='desctext'>
                                    {this.state.Message}
                                </div>
                            </InfoRow>
                        </SimpleCell>
                    {this.state.showDecode &&
                    <SimpleCell>
                        <InfoRow>
                            <b className='Mosttext'>Сообщение после функции:</b>
                            <div style={{display: "flex"}}>
                            <div  style={{background: this.state.color}} className='desctext'>
                            <b>{this.state.Decode}</b>
                            </div>
                            <Button className='tipbut' mode="secondary" before={<Icon24Education style={{color:'#dbe0f8'}}/>} onClick={this.showhelp}>Помощь</Button>
                            </div>
                        </InfoRow>
                    </SimpleCell>
                    }
                    {this.state.allowtip && <Div> {this.state.helptext}</Div>}
                    <Div>
                        <b className='Mosttext'>Задача:</b>
                    <InfoRow className='desctext'>
                        Ваша задача - ввести функцю, применив которую к каждому символу, можно получить зашифрованное сообщение.
                            В качестве "буквы" используйте <b>x</b>, а для возведения в степень <b>^</b>. Пример ввода: <b>(x^2+11*2)%5</b>
                    </InfoRow>
                    </Div>
                    <Div>
                        <b className='Mosttext'>Функция, по которой шифровали:</b>
                        <InfoRow className='desctext'>
                            {this.state.CipherFunc}
                        </InfoRow>
                    </Div>
                </Group>
                <form onSubmit={this.confirmInput} >
                <Div style={{display:'flex'}}>
                    <Input value={this.state.inputData.answer}
                           type="text"
                           pattern="[Xx0-9\-\+\/\^\*\(\)%]*"
                           onChange={this.handleInput}
                           name="answer"
                           placeholder="Ваш ответ"
                           autoComplete="off"/>
                    <Button size="l" className="startbutt" >Применить функцию</Button>
                    </Div>
                </form>
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
