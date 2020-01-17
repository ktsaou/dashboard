import { prop } from "ramda"
import { createSelector } from "reselect"

import { AppStateT } from "store/app-state"
import { initialSingleState } from "./reducer"
import { storeKey } from "./constants"

export const selectChartsState = (state: AppStateT) => state[storeKey]
export const selectSingleChartState = createSelector(
  selectChartsState,
  (_: any, { id }: { id: string }) => id,
  (chartsState, id) => chartsState[id] || initialSingleState,
)

export const selectChartData = createSelector(
  selectSingleChartState,
  (chartState) => chartState.chartData,
)

const selectChartDetails = createSelector(selectSingleChartState, prop("chartDetails"))
const selectIsFetchingDetails = createSelector(selectSingleChartState, prop("isFetchingDetails"))

export const makeSelectChartDetailsRequest = () => createSelector(
  selectChartDetails,
  selectIsFetchingDetails,
  (chartDetails, isFetchingDetails) => ({ chartDetails, isFetchingDetails }),
)

export const selectChartViewRange = createSelector(
  selectSingleChartState,
  (chartState) => chartState.fetchDataParams.viewRange,
)

export const selectChartFetchDataParams = createSelector(
  selectSingleChartState,
  (chartState) => chartState.fetchDataParams,
)

export const selectResizeHeight = createSelector(
  selectSingleChartState,
  (chartState) => chartState.resizeHeight,
)


export const selectAmountOfFetchedCharts = createSelector(
  selectChartsState,
  (chartsState) => Object.values(chartsState)
    // count the nr of "success" or "failure" charts
    .map((chartState) => chartState.isFetchDataFailure
      || Boolean(chartState.chartData) || Boolean(chartState.isFetchDetailsFailure))
    .reduce((acc, value) => acc + Number(value), 0),
)

export const selectAmountOfCharts = createSelector(
  selectChartsState,
  (chartsState) => Object.keys(chartsState).length,
)

export const selectNameOfAnyFetchingChart = createSelector(
  selectChartsState,
  (chartsState) => Object.values(chartsState)
    .find((chartState) => chartState.isFetchingData)?.chartDetails?.id,
)