# Form implementation generated from reading ui file 'design.ui'
#
# Created by: PyQt6 UI code generator 6.5.1
#
# WARNING: Any manual changes made to this file will be lost when pyuic6 is
# run again.  Do not edit this file unless you know what you are doing.


from PyQt6 import QtCore, QtGui, QtWidgets


class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(1268, 647)
        icon = QtGui.QIcon()
        icon.addPixmap(QtGui.QPixmap("icons/icons8-chat-48.png"), QtGui.QIcon.Mode.Normal, QtGui.QIcon.State.Off)
        MainWindow.setWindowIcon(icon)
        MainWindow.setWindowOpacity(1.0)
        MainWindow.setStyleSheet("background-color: rgb(0, 0, 0);")
        MainWindow.setIconSize(QtCore.QSize(30, 30))
        MainWindow.setTabShape(QtWidgets.QTabWidget.TabShape.Rounded)
        self.centralwidget = QtWidgets.QWidget(parent=MainWindow)
        self.centralwidget.setEnabled(True)
        self.centralwidget.setStyleSheet("")
        self.centralwidget.setObjectName("centralwidget")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.centralwidget)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.left_menu = QtWidgets.QWidget(parent=self.centralwidget)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Policy.Ignored, QtWidgets.QSizePolicy.Policy.Preferred)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.left_menu.sizePolicy().hasHeightForWidth())
        self.left_menu.setSizePolicy(sizePolicy)
        self.left_menu.setMinimumSize(QtCore.QSize(100, 0))
        self.left_menu.setMaximumSize(QtCore.QSize(300, 16777215))
        self.left_menu.setStyleSheet("QWidget#left_sub_menu{\n"
"    opacity: 1.0;\n"
"    background-color: rgb(0, 0, 0);\n"
"    border-radius: 20px;\n"
"}\n"
"\n"
"QFrame {\n"
"    border: 2px solid white; \n"
"    border-radius: 15px; \n"
"    background-color: rgb(149, 255, 149);\n"
"}\n"
"\n"
"QLabel{\n"
"    color: rgb(0, 0, 0);\n"
"    border: 0;\n"
"    border-radius: 0;\n"
"}\n"
"\n"
"QPushButton{\n"
"    \n"
"    color: rgb(0, 0, 0);\n"
"    background-color: rgb(85, 255, 127);\n"
"}\n"
"\n"
"QComboBox{\n"
"    \n"
"    color: rgb(0, 170, 0);\n"
"    selection-color: rgb(255, 255, 255);\n"
"    selection-background-color: rgb(0, 0, 0);\n"
"}\n"
"\n"
"\n"
"\n"
"")
        self.left_menu.setObjectName("left_menu")
        self.verticalLayout = QtWidgets.QVBoxLayout(self.left_menu)
        self.verticalLayout.setContentsMargins(9, -1, 9, -1)
        self.verticalLayout.setObjectName("verticalLayout")
        self.left_sub_menu = QtWidgets.QWidget(parent=self.left_menu)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Policy.Preferred, QtWidgets.QSizePolicy.Policy.Preferred)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.left_sub_menu.sizePolicy().hasHeightForWidth())
        self.left_sub_menu.setSizePolicy(sizePolicy)
        self.left_sub_menu.setMaximumSize(QtCore.QSize(300, 16777215))
        self.left_sub_menu.setStyleSheet("")
        self.left_sub_menu.setObjectName("left_sub_menu")
        self.verticalLayout_2 = QtWidgets.QVBoxLayout(self.left_sub_menu)
        self.verticalLayout_2.setObjectName("verticalLayout_2")
        self.frame = QtWidgets.QFrame(parent=self.left_sub_menu)
        self.frame.setEnabled(True)
        self.frame.setAutoFillBackground(False)
        self.frame.setStyleSheet("")
        self.frame.setFrameShape(QtWidgets.QFrame.Shape.NoFrame)
        self.frame.setFrameShadow(QtWidgets.QFrame.Shadow.Raised)
        self.frame.setObjectName("frame")
        self.horizontalLayout_4 = QtWidgets.QHBoxLayout(self.frame)
        self.horizontalLayout_4.setObjectName("horizontalLayout_4")
        self.home_btn = QtWidgets.QPushButton(parent=self.frame)
        font = QtGui.QFont()
        font.setFamily("Cascadia Code")
        font.setPointSize(14)
        font.setBold(True)
        self.home_btn.setFont(font)
        self.home_btn.setStyleSheet("")
        icon1 = QtGui.QIcon()
        icon1.addPixmap(QtGui.QPixmap("icons/icons8-home-48.png"), QtGui.QIcon.Mode.Normal, QtGui.QIcon.State.Off)
        self.home_btn.setIcon(icon1)
        self.home_btn.setIconSize(QtCore.QSize(30, 30))
        self.home_btn.setFlat(True)
        self.home_btn.setObjectName("home_btn")
        self.horizontalLayout_4.addWidget(self.home_btn)
        self.verticalLayout_2.addWidget(self.frame)
        self.frame_2 = QtWidgets.QFrame(parent=self.left_sub_menu)
        self.frame_2.setStyleSheet("")
        self.frame_2.setFrameShape(QtWidgets.QFrame.Shape.NoFrame)
        self.frame_2.setFrameShadow(QtWidgets.QFrame.Shadow.Raised)
        self.frame_2.setObjectName("frame_2")
        self.verticalLayout_3 = QtWidgets.QVBoxLayout(self.frame_2)
        self.verticalLayout_3.setObjectName("verticalLayout_3")
        self.label = QtWidgets.QLabel(parent=self.frame_2)
        font = QtGui.QFont()
        font.setFamily("Cascadia Code")
        font.setPointSize(14)
        font.setBold(True)
        self.label.setFont(font)
        self.label.setLayoutDirection(QtCore.Qt.LayoutDirection.LeftToRight)
        self.label.setAlignment(QtCore.Qt.AlignmentFlag.AlignCenter)
        self.label.setWordWrap(False)
        self.label.setObjectName("label")
        self.verticalLayout_3.addWidget(self.label)
        self.menu_btn = QtWidgets.QComboBox(parent=self.frame_2)
        self.menu_btn.setEnabled(True)
        font = QtGui.QFont()
        font.setFamily("Cascadia Code")
        font.setPointSize(14)
        self.menu_btn.setFont(font)
        self.menu_btn.setContextMenuPolicy(QtCore.Qt.ContextMenuPolicy.ActionsContextMenu)
        self.menu_btn.setStyleSheet("")
        self.menu_btn.setEditable(False)
        self.menu_btn.setObjectName("menu_btn")
        self.menu_btn.addItem("")
        self.menu_btn.addItem("")
        self.menu_btn.addItem("")
        self.menu_btn.addItem("")
        self.verticalLayout_3.addWidget(self.menu_btn)
        self.verticalLayout_2.addWidget(self.frame_2)
        spacerItem = QtWidgets.QSpacerItem(20, 40, QtWidgets.QSizePolicy.Policy.Minimum, QtWidgets.QSizePolicy.Policy.Expanding)
        self.verticalLayout_2.addItem(spacerItem)
        self.frame_3 = QtWidgets.QFrame(parent=self.left_sub_menu)
        self.frame_3.setStyleSheet("")
        self.frame_3.setFrameShape(QtWidgets.QFrame.Shape.NoFrame)
        self.frame_3.setFrameShadow(QtWidgets.QFrame.Shadow.Raised)
        self.frame_3.setObjectName("frame_3")
        self.horizontalLayout_2 = QtWidgets.QHBoxLayout(self.frame_3)
        self.horizontalLayout_2.setObjectName("horizontalLayout_2")
        self.settings_btn = QtWidgets.QPushButton(parent=self.frame_3)
        font = QtGui.QFont()
        font.setFamily("Cascadia Code")
        font.setPointSize(12)
        font.setBold(True)
        self.settings_btn.setFont(font)
        self.settings_btn.setStyleSheet("")
        icon2 = QtGui.QIcon()
        icon2.addPixmap(QtGui.QPixmap("icons/icons8-settings-48.png"), QtGui.QIcon.Mode.Normal, QtGui.QIcon.State.Off)
        self.settings_btn.setIcon(icon2)
        self.settings_btn.setFlat(True)
        self.settings_btn.setObjectName("settings_btn")
        self.horizontalLayout_2.addWidget(self.settings_btn)
        self.verticalLayout_2.addWidget(self.frame_3)
        self.verticalLayout.addWidget(self.left_sub_menu, 0, QtCore.Qt.AlignmentFlag.AlignHCenter)
        self.horizontalLayout.addWidget(self.left_menu)
        self.main = QtWidgets.QWidget(parent=self.centralwidget)
        self.main.setMaximumSize(QtCore.QSize(1100, 16777215))
        self.main.setObjectName("main")
        self.gridLayout = QtWidgets.QGridLayout(self.main)
        self.gridLayout.setObjectName("gridLayout")
        self.main_text = QtWidgets.QTextEdit(parent=self.main)
        self.main_text.setEnabled(True)
        sizePolicy = QtWidgets.QSizePolicy(QtWidgets.QSizePolicy.Policy.Preferred, QtWidgets.QSizePolicy.Policy.Preferred)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(self.main_text.sizePolicy().hasHeightForWidth())
        self.main_text.setSizePolicy(sizePolicy)
        font = QtGui.QFont()
        font.setFamily("Cascadia Code")
        font.setPointSize(12)
        self.main_text.setFont(font)
        self.main_text.setStyleSheet("QTextEdit {\n"
"border: 3px solid white; \n"
"border-radius: 20px; \n"
"padding: 10px;\n"
"background-color: rgb(0, 0, 0);\n"
"color: rgb(0, 255, 0);\n"
"}\n"
"\n"
"")
        self.main_text.setReadOnly(True)
        self.main_text.setObjectName("main_text")
        self.gridLayout.addWidget(self.main_text, 0, 0, 1, 2)
        self.pushButton = QtWidgets.QPushButton(parent=self.main)
        font = QtGui.QFont()
        font.setFamily("Cascadia Code")
        font.setPointSize(12)
        self.pushButton.setFont(font)
        self.pushButton.setStyleSheet("color: rgb(255, 255, 255);\n"
"background-color: rgb(0, 0, 0);")
        self.pushButton.setText("")
        icon3 = QtGui.QIcon()
        icon3.addPixmap(QtGui.QPixmap("icons/icons8-send-48.png"), QtGui.QIcon.Mode.Normal, QtGui.QIcon.State.Off)
        self.pushButton.setIcon(icon3)
        self.pushButton.setIconSize(QtCore.QSize(20, 20))
        self.pushButton.setFlat(True)
        self.pushButton.setObjectName("pushButton")
        self.gridLayout.addWidget(self.pushButton, 1, 1, 1, 1)
        self.user_input = QtWidgets.QLineEdit(parent=self.main)
        font = QtGui.QFont()
        font.setFamily("Cascadia Code")
        font.setPointSize(12)
        self.user_input.setFont(font)
        self.user_input.setStyleSheet("QLineEdit {\n"
"border: 3px solid white; \n"
"border-radius: 20px; \n"
"padding: 10px;\n"
"background-color: rgb(0, 0, 0);\n"
"color: rgb(0, 255, 0);\n"
"}\n"
"\n"
"\n"
"\n"
"")
        self.user_input.setClearButtonEnabled(False)
        self.user_input.setObjectName("user_input")
        self.gridLayout.addWidget(self.user_input, 1, 0, 1, 1)
        self.horizontalLayout.addWidget(self.main)
        MainWindow.setCentralWidget(self.centralwidget)

        self.retranslateUi(MainWindow)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        _translate = QtCore.QCoreApplication.translate
        MainWindow.setWindowTitle(_translate("MainWindow", "Chatbot"))
        self.home_btn.setText(_translate("MainWindow", "Home"))
        self.label.setText(_translate("MainWindow", "Mode"))
        self.menu_btn.setCurrentText(_translate("MainWindow", "DMC"))
        self.menu_btn.setItemText(0, _translate("MainWindow", "DMC"))
        self.menu_btn.setItemText(1, _translate("MainWindow", "Question Answer"))
        self.menu_btn.setItemText(2, _translate("MainWindow", "Doctor"))
        self.menu_btn.setItemText(3, _translate("MainWindow", "Friend"))
        self.settings_btn.setText(_translate("MainWindow", "Settings"))
        self.user_input.setPlaceholderText(_translate("MainWindow", "Enter text here"))


if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    MainWindow = QtWidgets.QMainWindow()
    ui = Ui_MainWindow()
    ui.setupUi(MainWindow)
    MainWindow.show()
    sys.exit(app.exec())
