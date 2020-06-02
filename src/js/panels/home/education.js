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
                        <h3>Главная</h3>
                    </Button>
                    <h2 className='headertext'> Обучение</h2>
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
                        Задачи этого и последующих уровней более сложные, так как используют операцию взятия по модулю. Однако и эту задачу можно решить.<br/>
                        Рассмотрим на примере: <br/>
                        <p>
                            Пусть наш шифр - <b>(x+60)%49+1</b>.<br/>
                            Тогда ответом будет либо (49+(x-13)%49)%49+1, либо (x+36)%49+1. Почему так?</p><p>
                        Во-первых, рассмотрим сдвиг и число, по модулю которого мы берём. Найдём 60 по модулю 49:
                        это либо 11, либо -38, чтобы найти обратную функцию нужно взять найденные числа с другим знаком.
                        Вычтем из этих чисел по единице, которая добавлена в конце шифрующей функции, чтобы получить число от 1 до (в данном случае) 49.
                        Сейчас у нас числа -12 и 37.</p><p> Напомним, что в конце нашей функции нам так же следует прибавить единицу, так как алфавит
                        нумеруется от 1 до 32, эту же единицу мы должны забрать из уже имеющихся чисел, и так, мы получаем -13(+1) и 36(+1).
                        Теперь осталось просто записать это, использую операцию взятия по тому же модулю. Итак, мы получаем два варианта ответа:<br/>
                        <b>(49+(x-13)%49)%49+1</b> или <b>(x+36)%49+1</b>.</p>
                        Может возникнуть вопрос: откуда взялись "лишние" действия в первом варианте? Ответ прост: взятие по модулю отрицательного числа
                        (а в данном случае мы получаем отрицательное число для всех x&#60;13) даёт результатом отрицательное число, чтобы этого избежать, воспользуемся формулой&nbsp;
                        <b>a%b=(b+a%b)%b</b>, справа будет всегда стоять положительное число или ноль.
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
