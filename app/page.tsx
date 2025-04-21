import React from 'react'
import { PromptingIsAllYouNeed } from "../prompting"
import { SettingsPanel } from "../components/SettingsPanel"
import NetlifyStats from "../components/NetlifyStats"
import ActionLogger from "../components/ActionLogger"

export default function Home() {
  return (
    <>
      <PromptingIsAllYouNeed />
      <SettingsPanel />
      <NetlifyStats />
      <ActionLogger />
    </>
  )
}
