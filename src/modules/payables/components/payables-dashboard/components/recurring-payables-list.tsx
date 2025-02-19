import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Mercoa } from '@mercoa/javascript'
import accounting from 'accounting'
import dayjs from 'dayjs'
import { Skeleton } from '../../../../../components'
import { currencyCodeToSymbol } from '../../../../../lib/currency'

export function RecurringPayablesList({
  recurringPayablesData,
  isRecurringPayablesLoading,
  onSelectInvoice,
}: {
  recurringPayablesData?: Mercoa.InvoiceTemplateResponse[]
  isRecurringPayablesLoading: boolean
  onSelectInvoice?: (invoice: Mercoa.InvoiceTemplateResponse) => void
}) {
  if (isRecurringPayablesLoading || !recurringPayablesData) {
    return <Skeleton rows={3} />
  }

  const draftStatuses: Mercoa.InvoiceStatus[] = [
    Mercoa.InvoiceStatus.Draft,
    Mercoa.InvoiceStatus.New,
    Mercoa.InvoiceStatus.Approved,
  ]

  const sections: {
    title: string
    invoices: Mercoa.InvoiceTemplateResponse[]
  }[] = [
    {
      title: 'Active',
      invoices: recurringPayablesData.filter(
        (recurringPayable) => recurringPayable.status === Mercoa.InvoiceStatus.Scheduled,
      ),
    },
    {
      title: 'Draft',
      invoices: recurringPayablesData.filter((recurringPayable) => draftStatuses.includes(recurringPayable.status)),
    },
    {
      title: 'Canceled',
      invoices: recurringPayablesData.filter(
        (recurringPayable) => recurringPayable.status === Mercoa.InvoiceStatus.Canceled,
      ),
    },
  ]

  return (
    <div className="mercoa-flex mercoa-flex-col mercoa-gap-6">
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="mercoa-text-xl mercoa-font-medium mercoa-text-gray-900 mercoa-mb-2">{section.title}</h2>
          <div className="mercoa-flex mercoa-flex-col mercoa-gap-2">
            {section.invoices.length === 0 ? (
              <InvoiceTemplateCard />
            ) : (
              <>
                {section.invoices.map((invoiceTemplate) => (
                  <InvoiceTemplateCard
                    key={invoiceTemplate.id}
                    invoiceTemplate={invoiceTemplate}
                    onSelectInvoice={onSelectInvoice}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function InvoiceTemplateCard({
  invoiceTemplate,
  onSelectInvoice,
}: {
  invoiceTemplate?: Mercoa.InvoiceTemplateResponse
  onSelectInvoice?: (invoice: Mercoa.InvoiceTemplateResponse) => void
}) {
  if (!invoiceTemplate) {
    return (
      <div className="mercoa-bg-white mercoa-rounded-sm mercoa-border mercoa-border-gray-200">
        <div className="mercoa-p-4 mercoa-text-sm mercoa-text-gray-500">No recurring invoices found</div>
      </div>
    )
  }

  const { vendor, amount, currency, deductionDate, paymentSchedule } = invoiceTemplate
  const parts = []
  if (amount) {
    parts.push(accounting.formatMoney(amount, currencyCodeToSymbol(currency ?? 'USD')))
  }
  if (paymentSchedule && paymentSchedule.type !== 'oneTime') {
    parts.push(paymentSchedule.type)
  }
  if (deductionDate) {
    parts.push(`starting on ${dayjs(deductionDate).format('MMM D, YYYY')}`)
  }

  let text = parts.length >= 2 ? parts.join(' ') : 'Draft recurrence details pending'
  text = text.charAt(0).toUpperCase() + text.slice(1)

  return (
    <div
      className="mercoa-bg-white mercoa-rounded-sm mercoa-border mercoa-border-gray-200 mercoa-p-4 mercoa-flex mercoa-items-center mercoa-justify-between mercoa-cursor-pointer hover:mercoa-bg-gray-50"
      onClick={() => onSelectInvoice?.(invoiceTemplate)}
    >
      <div className="mercoa-flex mercoa-items-center">
        <div className="mercoa-flex mercoa-items-center mercoa-justify-center mercoa-bg-gray-100 mercoa-rounded-full mercoa-h-10 mercoa-w-10 mercoa-text-sm mercoa-font-medium mercoa-text-gray-600 mercoa-border mercoa-border-gray-300">
          {vendor?.name
            ?.split(' ')
            .map((word) => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase() ?? 'V'}
        </div>
        <div className="mercoa-ml-4">
          <div className="mercoa-text-sm mercoa-font-medium mercoa-text-gray-900">{vendor?.name || 'Vendor'}</div>
          <div className="mercoa-text-xs mercoa-text-gray-500">{text}</div>
        </div>
      </div>
      <div className="mercoa-text-gray-400 mercoa-text-lg">
        <ArrowRightIcon className="mercoa-w-5 mercoa-h-5" />
      </div>
    </div>
  )
}
