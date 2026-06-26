import { Fragment } from 'react'
import { PageSectionRecord } from '@/services/page_sections'
import { useAdminMode } from '@/hooks/use-admin-mode'
import { AddSectionButton, EditableSectionWrapper } from '@/components/AdminSectionControls'
import { SectionRenderer } from '@/components/SectionRenderer'

export function PageSections({
  sections,
  pageSlug,
}: {
  sections: PageSectionRecord[]
  pageSlug?: string
}) {
  const { isEditingMode } = useAdminMode()
  const slug = pageSlug || sections[0]?.page_slug || 'home'

  return (
    <div className="flex flex-col">
      {isEditingMode && <AddSectionButton pageSlug={slug} order={0} sections={sections} />}
      {sections.map((section) => (
        <Fragment key={section.id}>
          {isEditingMode ? (
            <EditableSectionWrapper section={section} sections={sections}>
              <SectionRenderer section={section} />
            </EditableSectionWrapper>
          ) : (
            <SectionRenderer section={section} />
          )}
          {isEditingMode && (
            <AddSectionButton pageSlug={slug} order={section.order + 1} sections={sections} />
          )}
        </Fragment>
      ))}
    </div>
  )
}
