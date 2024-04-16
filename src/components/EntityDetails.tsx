import { Square2StackIcon } from '@heroicons/react/24/outline'
import { Mercoa } from '@mercoa/javascript'
import { toast } from 'react-toastify'
import { useMercoaSession } from './Mercoa'
import { Tooltip } from './index'

export function EntityDetails({ children }: { children: Function }) {
  const mercoaSession = useMercoaSession()
  if (children) return children({ entity: mercoaSession.entity, organization: mercoaSession.organization })
}

export function EntityStatus({ entity }: { entity?: Mercoa.EntityResponse }) {
  const mercoaSession = useMercoaSession()
  entity = entity || mercoaSession.entity
  if (!entity) return <></>

  return (
    <>
      {entity.status === 'unverified' && (
        /* @ts-ignore:next-line */
        <Tooltip title="Can only receive funds">
          <span className="mercoa-inline-flex mercoa-items-center mercoa-rounded-full mercoa-bg-indigo-100 mercoa-px-2.5 mercoa-py-0.5 mercoa-text-xs mercoa-font-medium mercoa-text-indigo-800">
            Unverified
          </span>
        </Tooltip>
      )}
      {entity.status === 'verified' && (
        /* @ts-ignore:next-line */
        <Tooltip title="Can send and receive funds">
          <span className="mercoa-inline-flex mercoa-items-center mercoa-rounded-full mercoa-bg-green-100 mercoa-px-2.5 mercoa-py-0.5 mercoa-text-xs mercoa-font-medium mercoa-text-green-800">
            Verified
          </span>
        </Tooltip>
      )}
      {(entity.status === 'pending' || entity.status === 'review') && (
        /* @ts-ignore:next-line */
        <Tooltip title="Can only receive funds">
          <span className="mercoa-inline-flex mercoa-items-center mercoa-rounded-full mercoa-bg-yellow-100 mercoa-px-2.5 mercoa-py-0.5 mercoa-text-xs mercoa-font-medium mercoa-text-yellow-800">
            Pending
          </span>
        </Tooltip>
      )}
      {(entity.status === 'resubmit' || entity.status === 'failed') && (
        /* @ts-ignore:next-line */
        <Tooltip title="Can only receive funds">
          <span className="mercoa-inline-flex mercoa-items-center mercoa-rounded-full mercoa-bg-red-100 mercoa-px-2.5 mercoa-py-0.5 mercoa-text-xs mercoa-font-medium mercoa-text-red-800">
            VERIFICATION FAILED
          </span>
        </Tooltip>
      )}
    </>
  )
}

export function EntityInboxEmail({ entity }: { entity?: Mercoa.EntityResponse }) {
  const mercoaSession = useMercoaSession()
  const entitySelected = entity || mercoaSession.entity
  return (
    <button
      className="mercoa-flex mercoa-gap-1 mercoa-items-center mercoa-text-gray-600"
      onClick={() => {
        // copy email address to clipboard
        navigator.clipboard.writeText(
          `${entitySelected?.emailTo ?? ''}@${mercoaSession.organization?.emailProvider?.inboxDomain}`,
        )
        toast.success('Email address copied')
      }}
    >
      <Square2StackIcon className="mercoa-w-5 mercoa-h-5" />
      {entitySelected?.emailTo ?? ''}@{mercoaSession.organization?.emailProvider?.inboxDomain}
    </button>
  )
}
