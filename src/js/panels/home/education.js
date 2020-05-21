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
    Tabs, PanelHeaderBack
} from "@vkontakte/vkui";
import {setFormData} from "../../store/formData/actions";

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
            <Panel id={id}>
                <PanelHeader
                    left={<PanelHeaderBack onClick={() => goBack()}/>}
                >
                    Обучение
                </PanelHeader>
                <FixedLayout vertical="top">
                    <Tabs theme="header" mode="default">
                        <HorizontalScroll id="EXAMPLE_TABS_LIST">

                            <TabsItem
                                onClick={() => this.setTab('ui')}
                                selected={this.state.activeTab === 'ui'}
                            >
                                Интерфейс
                            </TabsItem>
                            {/*<TabsItem
                                onClick={() => this.setTab('methods')}
                                selected={this.state.activeTab === 'methods'}
                            >
                                Методы решения
                            </TabsItem> */}
                        </HorizontalScroll>
                    </Tabs>
                </FixedLayout>
                <Group style={boxStyle}>
                    {this.state.activeTab === 'methods' && <Div>
                        Открыть модальное окно
                    </Div>}
                    {this.state.activeTab === 'ui' && <Div>
                        <h3>Старт</h3>
                        Для перехода к занятию нажмите кнопку "Начать" на начальной странице приложения.<br/>
                        <h3>Найстрока занятия</h3>
                        На следующей странице будет предложено выбрать сложность и упражнение. Сейчас доступно только одно упражнение -
                        "обрантные" функции. Выбор уровня сложности влияет на сложность нахождения обратной функции к той, по которой шифровался текст.
                        Вы можете вызвать подсказку, наведя указатель на уровень сложности и подождав секунду.
                        <br/>После выбора уровня и упражнения нажмите на кнопку перехода к выполнению.<br/>
                        <h3>Страница упражнения</h3>
                        Вверху открышейся страницы будет представлен текст, получившийся применением функции шфирования, которая отображается над полем ввода.
                        Ваша задача - вычислить функцию, применив которую к каждой букве зашифрованного сообщения, можно получить сообщение. В качестве
                        сообщений выступают имена существительные.<br/>
                        Когда Вы будете готовы ввести вариант ответа, используйте для этого поле ввода внизу страницы. В качестве буквы, к которой применяется функция,
                        используйте икс - "x". После ввода функции не забудьте подтвердить ввод, нажав на функцию применения. <br/>
                        В случае ввода правильного ответа Вы увидете соответствующее сообщение внизу экрана, а так же зашифрованное слово, при этом будет
                        автоматически сгенерирована следующая задача.
                        Если ответ оказался неправильным, то под зашифрованным словом отобразится результат применения функции, подсвеченный красным.
                        <h3>Дополнительные возможности</h3>
                        Вы можете вызвать выпадающий список нажатием на заголовок страницы.
                        В появившемся окне можно заменить задание на новое, а так же посмотреть количество правильно решенных задач.
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
