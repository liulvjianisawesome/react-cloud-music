import { configure, observable, action, runInAction, computed, autorun } from 'mobx'

configure({ enforceActions: true })

interface IResponse{
  status: any;
}

interface IPayload{
  status?: number;
  banners?: any[];
}

class Store {
  @observable public payload = null
  @observable public state = 'pending' // "pending" / "done" / "error"

  public fetchURL = () => {
    return fetch('/api/banner', {})
  }

  @action
  public fetchData() {
    this.state = 'pending'
    this.fetchURL().then(
      response => {
        if (response.status !== 200) {
          throw new Error('Fail to get response with status:' + response.status)
        }
        response.json().then((payload) => {
          runInAction(() => {
            this.state = 'done'
            this.payload = payload
          })
        }).catch((error) => {
          throw new Error('Invalid json response: ' + error)
        })
        // 将‘“最终的”修改放入一个异步动作中
      },
      error => {
        // 过程的另一个结局:...
        runInAction(() => {
          this.state = 'error'
        })
      }
    )
  }
}



export default Store