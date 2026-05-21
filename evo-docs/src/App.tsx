import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EvoNotification } from '@justin_evo/evo-ui'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ButtonPage from './pages/ButtonPage'
import CardPage from './pages/CardPage'
import InputPage from './pages/InputPage'
import RichTextAreaPage from './pages/RichTextAreaPage'
import RichTextAreaToolsPage from './pages/RichTextAreaToolsPage'
import RichTextAreaImagesPage from './pages/RichTextAreaImagesPage'
import RichTextAreaApiPage from './pages/RichTextAreaApiPage'
import CheckboxPage from './pages/CheckboxPage'
import RadioPage from './pages/RadioPage'
import SelectPage from './pages/SelectPage'
import AutoCompletePage from './pages/AutoCompletePage'
import TreeSelectPage from './pages/TreeSelectPage'
import TogglePage from './pages/TogglePage'
import BadgePage from './pages/BadgePage'
import ModalPage from './pages/ModalPage'
import AlertPage from './pages/AlertPage'
import TooltipPage from './pages/TooltipPage'
import NotificationPage from './pages/NotificationPage'
import StackPage from './pages/StackPage'
import GridPage from './pages/GridPage'
import TablePage from './pages/TablePage'
import TabsPage from './pages/TabsPage'
import PaginationPage from './pages/PaginationPage'
import DividerPage from './pages/DividerPage'
import SkeletonPage from './pages/SkeletonPage'
import ContainerPage from './pages/ContainerPage'
import FormPage from './pages/FormPage'
import NavPage from './pages/NavPage'
import BreadcrumbPage from './pages/BreadcrumbPage'
import TopNavPage from './pages/TopNavPage'
import UtilitiesPage from './pages/UtilitiesPage'
import ThemingPage from './pages/ThemingPage'
import ImageCropperPage from './pages/ImageCropperPage'
import ImageCropperApiPage from './pages/ImageCropperApiPage'
import ChangelogPage from './pages/ChangelogPage'
import AIPromptPage from './pages/AIPromptPage'
import CommandPalettePage from './pages/CommandPalettePage'

export default function App() {
  return (
    <BrowserRouter>
      <EvoNotification.Provider>
        <EvoNotification.Toaster />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/ai" element={<AIPromptPage />} />
            <Route path="/theming" element={<ThemingPage />} />
            <Route path="/components/button" element={<ButtonPage />} />
            <Route path="/components/card" element={<CardPage />} />
            <Route path="/components/input" element={<InputPage />} />
            <Route path="/components/rich-text-area" element={<RichTextAreaPage />} />
            <Route path="/components/rich-text-area/tools" element={<RichTextAreaToolsPage />} />
            <Route path="/components/rich-text-area/images" element={<RichTextAreaImagesPage />} />
            <Route path="/components/rich-text-area/api" element={<RichTextAreaApiPage />} />
            <Route path="/components/checkbox" element={<CheckboxPage />} />
            <Route path="/components/radio" element={<RadioPage />} />
            <Route path="/components/select" element={<SelectPage />} />
            <Route path="/components/tree-select" element={<TreeSelectPage />} />
            <Route path="/components/autocomplete" element={<AutoCompletePage />} />
            <Route path="/components/toggle" element={<TogglePage />} />
            <Route path="/components/badge" element={<BadgePage />} />
            <Route path="/components/modal" element={<ModalPage />} />
            <Route path="/components/alert" element={<AlertPage />} />
            <Route path="/components/tooltip" element={<TooltipPage />} />
            <Route path="/components/notification" element={<NotificationPage />} />
            <Route path="/components/stack" element={<StackPage />} />
            <Route path="/components/grid" element={<GridPage />} />
            <Route path="/components/table" element={<TablePage />} />
            <Route path="/components/tabs" element={<TabsPage />} />
            <Route path="/components/pagination" element={<PaginationPage />} />
            <Route path="/components/divider" element={<DividerPage />} />
            <Route path="/components/skeleton" element={<SkeletonPage />} />
            <Route path="/components/container" element={<ContainerPage />} />
            <Route path="/components/form" element={<FormPage />} />
            <Route path="/components/nav" element={<NavPage />} />
            <Route path="/components/breadcrumb" element={<BreadcrumbPage />} />
            <Route path="/components/topnav" element={<TopNavPage />} />
            <Route path="/components/command-palette" element={<CommandPalettePage />} />
            <Route path="/components/image-cropper" element={<ImageCropperPage />} />
            <Route path="/components/image-cropper/api" element={<ImageCropperApiPage />} />
            <Route path="/utilities" element={<UtilitiesPage />} />
          </Route>
        </Routes>
      </EvoNotification.Provider>
    </BrowserRouter>
  )
}
