import { ReactElement, useContext } from 'react'
import { Button } from '@material-ui/core'
import Wallet from 'remixicon-react/Wallet3LineIcon'
import ExchangeFunds from 'remixicon-react/ExchangeFundsLineIcon'
import Upload from 'remixicon-react/UploadLineIcon'

import { Context as BeeContext } from '../../providers/Bee'
import Card from '../../components/Card'
import Map from '../../components/Map'
import ExpandableListItem from '../../components/ExpandableListItem'
import { useNavigate } from 'react-router'
import { ROUTES } from '../../routes'
import { useIsBeeDesktop, useNewBeeDesktopVersion } from '../../hooks/apiHooks'
import { BEE_DESKTOP_LATEST_RELEASE_PAGE } from '../../utils/desktop'
import NodeInfoCard from './NodeInfoCard'

export default function Status(): ReactElement {
  const {
    status,
    latestUserVersion,
    isLatestBeeVersion,
    latestBeeVersionUrl,
    topology,
    nodeInfo,
    balance,
    chequebookBalance,
  } = useContext(BeeContext)
  const { isBeeDesktop, beeDesktopVersion } = useIsBeeDesktop()
  const { newBeeDesktopVersion } = useNewBeeDesktopVersion(isBeeDesktop)
  const navigate = useNavigate()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', alignContent: 'stretch' }}>
        <NodeInfoCard />
        <div style={{ width: '8px' }}></div>
        {nodeInfo?.beeMode && ['light', 'full', 'dev'].includes(nodeInfo.beeMode) ? (
          <Card
            buttonProps={{
              iconType: Wallet,
              children: 'Manage your wallet',
              onClick: () => navigate(ROUTES.ACCOUNT_WALLET),
            }}
            icon={<Wallet />}
            title={`${balance?.bzz.toSignificantDigits(4)} xBZZ | ${balance?.dai.toSignificantDigits(4)} xDAI`}
            subtitle="Current wallet balance."
            status="ok"
          />
        ) : (
          <Card
            buttonProps={{
              iconType: Wallet,
              children: 'Setup wallet',
              onClick: () => navigate(ROUTES.WALLET),
            }}
            icon={<Upload />}
            title="Your wallet is not setup."
            subtitle="To share content on Swarm, please setup your wallet."
            status="error"
          />
        )}
        {nodeInfo?.beeMode && ['light', 'full', 'dev'].includes(nodeInfo.beeMode) && (
          <>
            <div style={{ width: '8px' }} />
            {chequebookBalance?.availableBalance !== undefined &&
            chequebookBalance?.availableBalance.toBigNumber.isGreaterThan(0) ? (
              <Card
                buttonProps={{
                  iconType: ExchangeFunds,
                  children: 'View chequebook',
                  onClick: () => navigate(ROUTES.ACCOUNT_CHEQUEBOOK),
                }}
                icon={<ExchangeFunds />}
                title={`${chequebookBalance?.availableBalance.toSignificantDigits(4)} xBZZ`}
                subtitle="Current chequebook balance."
                status="ok"
              />
            ) : (
              <Card
                buttonProps={{
                  iconType: ExchangeFunds,
                  children: 'View chequebook',
                  onClick: () => navigate(ROUTES.ACCOUNT_CHEQUEBOOK),
                }}
                icon={<ExchangeFunds />}
                title={
                  chequebookBalance?.availableBalance
                    ? `${chequebookBalance.availableBalance.toFixedDecimal(4)} xBZZ`
                    : 'No available balance.'
                }
                subtitle="Chequebook not setup."
                status="error"
              />
            )}
          </>
        )}
      </div>
      <div style={{ height: '16px' }} />
      <Map error={status.topology.checkState !== 'OK'} />
      <div style={{ height: '2px' }} />
      <ExpandableListItem label="Connected peers" value={topology?.connected ?? '-'} />
      <ExpandableListItem label="Population" value={topology?.population ?? '-'} />
      <div style={{ height: '16px' }} />
      {isBeeDesktop && (
        <ExpandableListItem
          label="Desktop version"
          value={
            <div>
              {`${beeDesktopVersion} `}
              <Button
                size="small"
                variant="outlined"
                href={BEE_DESKTOP_LATEST_RELEASE_PAGE}
                target="_blank"
                style={{ height: '26px' }}
              >
                {newBeeDesktopVersion === '' ? 'latest' : 'update'}
              </Button>
            </div>
          }
        />
      )}
      <ExpandableListItem
        label="Bee version"
        value={
          <div>
            <a href="https://github.com/ethersphere/bee" rel="noreferrer" target="_blank">
              Bee
            </a>
            {` ${latestUserVersion ?? '-'} `}
            {latestUserVersion && !isBeeDesktop && (
              <Button
                size="small"
                variant="outlined"
                href={latestBeeVersionUrl}
                target="_blank"
                style={{ height: '26px' }}
              >
                {isLatestBeeVersion ? 'latest' : 'update'}
              </Button>
            )}
          </div>
        }
      />
      <ExpandableListItem label="Mode" value={nodeInfo?.beeMode} />
    </div>
  )
}
