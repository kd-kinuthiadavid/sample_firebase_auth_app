from flask import Flask, render_template
app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html', **locals())


@app.route('/profile')
def profile():
    return render_template('profile.html', **locals())


@app.route('/link_accounts')
def link_accounts():
    return render_template('link_accounts.html', **locals())
