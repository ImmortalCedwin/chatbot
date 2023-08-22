
import google.generativeai as palm

# Enter your own api key
palm.configure(api_key="AIzaSyDUoEjt1TuSBUqkH8YYL30rnQZQGvvPJbg") 

import sys
from PyQt6.QtWidgets import QApplication, QMainWindow
from PyQt6 import uic
from PyQt6.QtCore import QTimer
from design_python import Ui_MainWindow
Ui_MainWindow, QtBaseClass = uic.loadUiType("C:\Programming\Projects\Chat Alchemy\chatbot_desktop\design.ui")

from ai_resource import ai_resource
messages = []

mode = "Q&A"

class Window(QMainWindow):
  def __init__(self):
    super().__init__()

    self.ui = Ui_MainWindow()
    self.ui.setupUi(self)

    self.ui.send.clicked.connect(self.send)
    self.ui.user_input.returnPressed.connect(self.send)

    self.ui.home_btn.clicked.connect(self.home_screen)
    self.ui.translate_btn.clicked.connect(self.translate_screen)

    self.ui.main_text.setPlaceholderText("Current mode is: {0}".format(mode))
    self.ui.menu_btn.currentIndexChanged.connect(self.mode_select)
    self.ui.dmc_btn.currentIndexChanged.connect(self.mode_select_dmc)

    self.ui.submit_code_btn.clicked.connect(self.send_debug)
    self.ui.copy_code_btn.clicked.connect(self.copy_debug)

    self.ui.home_btn.click()

  def send(self):
    if self.ui.user_input.text()=="":
      return
    else :
      global human_data
      human_data = self.ui.user_input.text()
      human_text = "You: " + self.ui.user_input.text()
      html = f'<table><tr> <td style="border: 3px solid black; padding:10px;" ><h1 style="color:black; background-color: rgb(0, 170, 0);">{human_text}</h1></td></tr>'
      self.ui.main_text.insertHtml(html)
      self.ui.user_input.clear()
      QTimer.singleShot(100, self.ai_send)
    
  def ai_send(self):
    human_text = human_data
    if (mode=="Q&A"):
      defaults = ai_resource.defaults_qa
      context = ai_resource.context_qa
      examples = ai_resource.examples_qa
    elif(mode=="Friend"):
      defaults = ai_resource.defaults_friend
      context = ai_resource.context_friend
      examples = ai_resource.examples_friend
    elif(mode=="Doctor"):
      defaults = ai_resource.defaults_doctor
      context = ai_resource.context_doctor
      examples = ai_resource.examples_doctor
    elif(mode=="DMC"):
      ai_resource.input = human_text
      defaults = ai_resource.defaults_dmc
      prompt = ai_resource.generate_prompt(ai_resource)
    elif(mode=="Syllabus"):
      ai_resource.input = human_text
      defaults = ai_resource.defaults_dmc_syllabus
      prompt = ai_resource.generate_dmc_syllabus_prompt(ai_resource)
    
    if (mode=="DMC" or mode=="Syllabus"):
      response = palm.generate_text(
        **defaults,
        prompt=prompt
      )
    else:
      messages.append(human_text)
      response = palm.chat(
        **defaults,
        context=context,
        examples=examples,
        messages=messages
      )

    if (mode=="DMC"):
      ai_text = "DMC: " + response.result
    elif (mode=="Syllabus"):
      ai_text = "DMC: " + response.result
    elif (mode=="Q&A"):
      ai_text = "ChatBot: " + response.last
    elif (mode=="Friend"):
      ai_text = "Friend: " + response.last
    elif (mode=="Doctor"):
      ai_text = "Doctor: " + response.last
    
    html = f'<tr><td style="border: 3px solid black; padding:10px; "><h1 style="color:black; background-color: rgb(85, 255, 127);">{ai_text}</h1></td></tr>'
    self.ui.main_text.insertHtml(html)

  def send_debug(self):
    self.ui.debug_to.clear()
    ai_resource.input = self.ui.debug_from.toPlainText()
    defaults = ai_resource.defaults_debug
    prompt = ai_resource.generate_debug_prompt(ai_resource)
    response = palm.generate_text(
      **defaults,
      prompt=prompt
    )
    result = response.result

    self.ui.debug_to.setMarkdown(result)

  def copy_debug(self):
    text = self.ui.debug_to.toPlainText()
    cb = QApplication.clipboard()
    cb.setText(text)
  
  def mode_select(self):
    global mode

    if (self.ui.menu_btn.currentText() == "-Select-"):
      return
    else:
      messages.clear()
      self.ui.main_text.clear()
      self.ui.dmc_btn.setCurrentIndex(0)
      
      text = self.ui.menu_btn.currentText()
      mode = text

      self.ui.main_text.setPlaceholderText("Current mode is: {0}".format(mode))
  
  def mode_select_dmc(self):
    global mode
    
    if (self.ui.dmc_btn.currentText() == "-Select-"):
      return
    else:
      messages.clear()
      self.ui.main_text.clear()
      self.ui.menu_btn.setCurrentIndex(0)
      
      text = self.ui.dmc_btn.currentText()
      mode = text

      self.ui.main_text.setPlaceholderText("Current mode is: {0}".format(mode))

  def home_screen(self):
    self.ui.stackedWidget.setCurrentIndex(0)

  def translate_screen(self):
    self.ui.stackedWidget.setCurrentIndex(1)
       
app = QApplication(sys.argv)
window = Window()
window.show()
sys.exit(app.exec())