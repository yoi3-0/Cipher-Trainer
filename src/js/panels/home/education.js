import React from 'react';
import {connect} from 'react-redux';

import {setPage, goBack, openPopout, closePopout, openModal} from "../../store/router/actions";
import {setActiveTab, setScrollPositionByID} from "../../store/vk/actions";
import {restoreScrollPosition} from "../../services/_functions";

import {
    Div,
    Panel,
    Group,
    CellButton,
    PanelHeader,
    FixedLayout,
    HorizontalScroll,
    TabsItem,
    Tabs, PanelHeaderBack, Button
} from "@vkontakte/vkui";
import {setFormData} from "../../store/formData/actions";
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import IS_WEB from '@vkontakte/vk-bridge';

class HomePanelProfile extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: "ui"
        };
    }

    setTab(tab) {
        this.setState({
            activeTab: tab
        });
    }

    componentWillUnmount() {
        const {setScrollPositionByID, setActiveTab} = this.props;
        setScrollPositionByID("EXAMPLE_TABS_LIST");
    }

    componentDidMount() {
        restoreScrollPosition();
    }

    render() {
        const {id, setPage, goBack} = this.props;
        const boxStyle = {marginTop: 56};

        return (
            <Panel id={id} className='edu_one'>
                <Div className='headercontent'>
                    <Button mode="tertiary" size="l" before={<Icon24BrowserBack/>} onClick={() => goBack()} className='backButt'>
                        <h3>&nbsp;</h3>
                    </Button>
                    <h2 className='headertext'> ОБУЧЕНИЕ</h2>
                </Div >
                    <Tabs theme="header" mode="default" className="tabsdiv">
                        <HorizontalScroll id="EXAMPLE_TABS_LIST">

                            <TabsItem
                                className='tabbutt'
                                onClick={() => this.setTab('ui')}
                                selected={this.state.activeTab === 'ui'}
                            >
                                Интерфейс
                            </TabsItem>
                            <TabsItem
                                className='tabbutt'
                                onClick={() => this.setTab('methods')}
                                selected={this.state.activeTab === 'methods'}
                            >
                                Методы решения
                            </TabsItem>
                        </HorizontalScroll>
                    </Tabs>
                <Group style={boxStyle}>
                    {this.state.activeTab === 'methods' && <Div className='edutext'>
                        Здесь расписаны некоторые способы решения задач<br/>
                        <h3 className='headerEdu'>Вступление</h3>
                        Существует несколько оговорок, о которых следует знать для более продуктивной работы с тренажёром.<br/>
                        Во-первых, алфавит начинается с 1 (а) и заканчивается буквой с номером 32 (я). Используется алфавит без буквы "ё".<br/>
                        Во-вторых, для более интересного взаимодействия, в случае выхода за границы диапазона 1-32, будут использоваться символы, которые стоят
                        по соответствующую сторону от русских букв в таблице HTML-кодов символов.
                        <h3 className='headerEdu'>Тренировка</h3>
                        Тренировка - простейший уровень упражнения. Шифр заключается в простом сдвиге номера буквы в алфавите на некоторое число.
                        <br/>Метод решения такой задачи до смешного тривиальный: требуется применить обратный сдвиг. Например, в случае прибавления числа к номеру буквы -
                        вычесть то же число из полученного результата (шифра).
                        <h3 className='headerEdu'>Легкий уровень</h3>
                        Все уравнения "легкого" типа имеют вид <b>y = (x + a) mod b + 1</b>. Как же решать подобные односторонние функции? Давайте разбираться.<p>
                        Для начала перенесем единицу из правой части функции в левую, получим уравнение следующего вида: <b>y - 1 = (x + a) mod b</b>. Заметим, что <b>1 ≤ x ≤ b</b>, <b>1 ≤ y ≤ b</b>, тогда <b>0 ≤ x - 1 ≤ b - 1</b>,
                        <b>0 ≤ y - 1 ≤ b - 1</b>, что нас полностью устраивает, учитывая, что мы работаем с остатками. Тогда сделаем замену <b>y<sub>1</sub> = y - 1</b> и <b>x<sub>1</sub> = x - 1</b>, получим следующее уравнение:
                        <b>y<sub>1</sub> = (x<sub>1</sub> + a + 1) mod b</b>.</p><p> Далее мы должны посмотреть на <b>a</b>: <br/>1) если
                        <b>a + 1 &#60; b</b>, то мы просто снимаем <b>mod</b>, переносим <b>a + 1</b> на левую сторону и далее работаем с получившимся уравнением; <br/>2) если
                        <b>a + 1 > b</b>, то нам следует найти остаток от деления <b>a + 1</b> на <b>b</b>, а затем его перенести в левую часть уравнения.</p><p>
                        Уравнение после всех преобразований выше примет один из двух следующих видов: <b>x<sub>1</sub> = y<sub>1</sub> - a - 1</b> или <b>x<sub>1</sub> = y<sub>1</sub> - (a + 1) mod b</b>. Следующим этапом решения будет «навешивание» <b>mod</b>’a на получившееся уравнение. Получим следующие уравнения:
                        <b>x<sub>1</sub> = (y<sub>1</sub> - a - 1) mod b</b> или <b>x<sub>1</sub> = (y<sub>1</sub> - (a + 1) mod b) mod b</b>. Но есть одна загвоздка: <b>y<sub>1</sub> - a - 1</b> или <b>y<sub>1</sub> - (a + 1) mod b</b> могут быть отрицательными, и это помешает нам нормально использовать операцию деления с остатком. Чтобы у нас не возникало проблем, нужно проделать еще одно действие, а именно: добавить к полученным уравнениям <b>b</b>, а затем еще раз провести деление с остатком.
                    </p><p>Полученная формула – обратная к исходной, остается только заменить <b>y<sub>1</sub></b> на <b>x<sub>1</sub></b>, а <b>x<sub>1</sub></b> на <b>y<sub>1</sub></b> расписать их, как <b>x<sub>1</sub> = x - 1</b>, <b>y<sub>1</sub> = y - 1</b> и перенести единицу от <b>y</b> в другую часть уравнения.
                        Конечный вид обратной функции:
                        <b>y = (b + (x - a - 2) mod b) mod b + 1</b> или
                        <b>y = (b + (x - 1 - (a + 1) mod b) mod b) mod b + 1</b>.</p>
                        <h3 className='headerEdu'>Средний уровень</h3>
                        Все уравнения "среднего" типа имеют вид <b>y = (x∙a) mod b + 1</b>. Как же решать подобные односторонние функции? Давайте разбираться.<p>
                        Для начала перенесем единицу из правой части функции в левую, получим уравнение следующего вида: <b>y - 1 = (x∙a) mod b</b>. Заметим, что <b>1 ≤ x ≤ b</b>, <b>1 ≤ y ≤ b</b>, тогда <b>0 ≤ x - 1 ≤ b - 1</b>,
                        <b>0 ≤ y - 1 ≤ b - 1</b>, что нас полностью устраивает, учитывая, что мы работаем с остатками. Тогда сделаем замену <b>y<sub>1</sub> = y - 1</b> и <b>x<sub>1</sub> = x - 1</b>, получим следующее уравнение:
                        <b>y<sub>1</sub> = (x<sub>1</sub>∙a + 1∙a) mod b</b>. Далее нам предстоит "снять" деление с остатком и перенести <b>1∙a</b> в левую часть уравнения. Уравнение примет сл. вид: <b>x<sub>1</sub>∙a = y<sub>1</sub> - 1∙a</b>. Чтобы перейти к заключительной части решения, нам необходимо избавиться в левой части уравнения от <b>a</b>, сделать это можно очень просто, домножив обе части уравнения на <b>a<sup>-1</sup></b>, где <b>a<sup>-1</sup></b>— это обратное <b>a</b> по умножению в кольце вычетов<b>b</b>, т.е.
                        <b>(a∙a<sup>-1</sup>) mod b = 1</b> (если провести операцию нахождения остатка от деления над <b>a∙a<sup>-1</sup></b>, то мы получим <b>1</b>). Получим следующие уравнения: <b>x<sub>1</sub> = (y<sub>1</sub> - 1∙a)∙a<sup>-1</sup></b>). Осталось только «навесить» <b>mod b</b> и раскрыть <b>x<sub>1</sub></b> и <b>y<sub>1</sub></b>. Полученная формула станет обратной к исходной.
                        Конечный вид обратной функции:
                        <b>y = (a<sup>-1</sup>)(x - a - 1)) mod b + 1</b> </p>
                    </Div>}
                    {this.state.activeTab === 'ui' && <Div className='edutext'>
                        Для перехода к занятию нажмите кнопку "Начать" на начальной странице приложения.<br/>
                        <h3 className='headerEdu'>Настройка занятия</h3>
                        На следующей странице будет предложено выбрать сложность и упражнение. Сейчас доступно только одно упражнение -
                        "обратные" функции. Выбор уровня сложности влияет на сложность нахождения обратной функции к той, по которой шифровался текст.
                        Вы можете вызвать подсказку, наведя указатель на уровень сложности и подождав секунду.
                        <br/>После выбора уровня и упражнения нажмите на кнопку перехода к выполнению.<br/>
                        <h3 className='headerEdu'>Страница упражнения</h3>
                        Вверху открывшейся страницы будет представлен текст, получившийся применением функции шифрования, которая отображается над полем ввода.
                        Ваша задача - вычислить функцию, применив которую к каждой букве зашифрованного сообщения, можно получить сообщение. В качестве
                        сообщений выступают имена существительные.<br/>
                        Для ввода ответа, используйте поле внизу страницы. В качестве буквы, к которой применяется функция,
                        используйте икс - "x". После ввода функции не забудьте подтвердить ввод, нажав на функцию применения. <br/>
                        В случае ввода правильного ответа вы увидите соответствующее сообщение внизу экрана, а также зашифрованное слово, при этом будет
                        автоматически сгенерирована следующая задача.
                        Если ответ оказался неправильным, то под зашифрованным словом отобразится результат применения функции, подсвеченный красным.
                        <h3 className='headerEdu'>Дополнительные возможности</h3>
                        Вы можете вызвать выпадающий список нажатием на заголовок страницы.
                        В появившемся окне можно заменить задание на новое, а также посмотреть количество правильно решенных задач.
                    </Div>}
                </Group>
            </Panel>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        activeTab: state.vkui.activeTab,
    };
};

const mapDispatchToProps = {
    setFormData,
    goBack,
    setPage,
    openPopout,
    closePopout,
    openModal,
    setScrollPositionByID
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePanelProfile);
