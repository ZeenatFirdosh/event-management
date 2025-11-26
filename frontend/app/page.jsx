"use client"

import { Provider } from "react-redux"
import { store } from "../store/store"
import EventManagement from "../components/EventManagement"
import "../styles/components.css"

export default function Home() {
  return (
    <Provider store={store}>
      <EventManagement />
    </Provider>
  )
}
