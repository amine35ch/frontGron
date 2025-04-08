import CustomeAutoCompleteSelect from 'src/components/CustomeAutoCompleteSelect'
import { useGetListCompany } from 'src/services/company.service'

const InstallerSelect = props => {
  const {
    data: installerList,
    isLoading: isInstallerListLoading,
    isSuccess: isInstallerListSuccess
  } = useGetListCompany({
    type: 'ins',
    profile: 'entreprise'
  })

  return <CustomeAutoCompleteSelect option='id' displayOption='trade_name' data={installerList} {...props} />
}

export default InstallerSelect
