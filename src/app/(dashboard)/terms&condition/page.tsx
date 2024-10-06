'use client'
import Header from '@/components/header'
import React from 'react'

const page = () => {
    return (
        <div>
            <div>
                <Header link={`/profile`} title="Passcode Settings" />
            </div>
            <div className=' px-[24px]'>
                <h1 className=' mt-[24px] font-[500] text-[20px] '>
                    Permitted Use of Data
                </h1>
                <div className=' text-[#828282] leasding-[19.2px] '>The data collected by [App Name] is strictly used to provide budgeting and financial management services. This includes, but is not limited to:
                    <ul className=' list-disc'>
                        <li> Tracking and categorizing user transactions.</li>
                        <li>  Monitoring account balances.</li>
                        <li>Analyzing spending habits.</li>
                        <li> Generating financial reports, budgets, and insights.</li>
                    </ul>
                    The app will not use, share, or disclose personal or financial data for purposes unrelated to budgeting without the user's explicit consent.</div>
            </div>

            <div className=' px-[24px]'>
                <h1 className=' mt-[24px] font-[500] text-[20px] '>
                    Prohibited Data Usage
                </h1>
                <div className=' text-[#828282] leasding-[19.2px] '>
                    GoPrudy strictly prohibits:


                    <ul className=' list-disc '>
                        <li>  Sale of Data: User data will not be sold, rented, or traded to any third party for marketing, advertising, or promotional purposes.</li>
                        <li>  Unpermitted Use: Data will not be used for building user profiles, conducting targeted advertising, or any purpose beyond budgeting, unless explicitly agreed to by the user..</li>

                    </ul>
                </div>
            </div>
            <div className=' px-[24px]'>
                <h1 className=' mt-[24px] font-[500] text-[20px] '>
                    Third-Party Data Sharing
                </h1>
                <div className=' text-[#828282] leasding-[19.2px] '>
                    <ul className=' list-disc '>
                        <li>   Restricted Access to Service Providers: User data may be shared with third-party service providers (e.g., cloud storage, bank transaction syncing, or data analytics) only when necessary to perform the core budgeting functions. All third-party partners are bound by confidentiality agreements and are prohibited from using the data for any other purpose.</li>
                        <li>  No Sharing Beyond Core Budgeting Functions: The app will only share user data with third parties if it is directly related to the provision of budgeting services. For any other purpose, the app will obtain prior user consent.</li>
                        <li>Data Sharing with User Consent: In cases where [App Name] seeks to share data beyond budgeting purposes (e.g., for financial product recommendations or third-party offers), the user will be given the opportunity to opt in. Users will always retain the right to opt out of such data sharing.</li>

                    </ul>
                </div>
            </div>





            <div className=' px-[24px]'>
                <h1 className=' mt-[24px] font-[500] text-[20px] '>
                    Indemnification
                </h1>
                <div className=' text-[#828282] leasding-[19.2px] '>
                    <ul className=' list-disc '>
                        <li>   User Indemnification: Users agree to
                            indemnify, defend, and hold harmless [App
                            Name, its officers, employees, partners,
                            and affiliates from any claims, damages, or
                            liabilities resulting from:

                            <ul>
                                <li>The misuse of their data by
                                    unauthorized third parties, including
                                    but not limited to hackers or external
                                    actors.</li>
                                <li>The user's improper use of the app or
                                    breach of the terms of service..</li>
                                <li>Legal disputes arising from the user's
                                    failure to comply with applicable laws
                                    when using the app (e.g., providing
                                    false information).</li>

                            </ul>
                        </li>
                        <li>  App Indemnification: [App Name] agrees to
                            indemnify and hold users harmless for:

                            <ul>
                                <li>
                                    Any unauthorized disclosure of their
                                    data resulting from the app's
                                    negligence or willful misconduct.
                                </li>
                                <li>
                                    Breaches of data protection regulations
                                    (e.g., GDPR, CCPA)
                                </li>
                                <li>
                                    Any violations of the app's data
                                    protection promises made in this
                                    clause.
                                </li>
                            </ul>

                        </li>


                    </ul>
                </div>





            </div>



            <div className=' px-[24px]'>
                <h1 className=' mt-[24px] font-[500] text-[20px] '>
                    Data Security
                </h1>
                <div className=' text-[#828282] leasding-[19.2px] '>
                    <ul className=' list-disc '>
                        <li>  Encryption and Storage: All user data will
                            be encrypted during transmission and at
                            rest. [App Name] will employ industry-
                            standard security measures to safeguard
                            against unauthorized access or breaches.
                        </li>
                        <li>  Access Controls: Only authorized
                            personnel will have access to user data,
                            and their access will be monitored and
                            logged to ensure compliance with this
                            policy.</li>


                    </ul>
                </div>
            </div>





            <div className=' px-[24px]'>
                <h1 className=' mt-[24px] font-[500] text-[20px] '>
                    User Rights
                </h1>
                <div className=' text-[#828282] leasding-[19.2px] '>
                    <ul className=' list-disc '>
                        <li>  Data Deletion Requests: Users have the
                            right to request the deletion of their
                            personal and financial data. Upon such a
                            request, [App Name] will delete the user's
                            data from its servers and notify any third-
                            party service providers to do the same
                            within 30 days.
                        </li>
                        <li> Revocation of Consent: Users may revoke
                            their consent for data sharing at any time.
                            Upon revocation, App Name will
                            immediately cease sharing the user's data
                            for purposes beyond the app's core
                            functionality.</li>


                    </ul>
                </div>
            </div>






            <div className=' px-[24px]'>
                <h1 className=' mt-[24px] font-[500] text-[20px] '>
                    Limitation of Liability
                </h1>
                <div className=' text-[#828282] leasding-[19.2px] '>
                    <ul className=' list-disc '>
                        <li>  No Liability for Third-Party Misuse: [App
                            Name] is not liable for any misuse of user
                            data by third-party services or apps that
                            users link to App Name, particularly if the
                            user has given them permission outside of
                            [App Name].
                        </li>
                        <li> Limited Liability for External Breaches: The
                            app is not liable for data breaches or
                            cyberattacks beyond its reasonable
                            control, provided [App Name] has
                            implemented industry-standard security
                            measures.</li>
                        <li>Exclusion for User Negligence: [App Name]
                            is not liable for any issues arising from user
                            negligence, such as sharing login
                            credentials, or failure to follow security
                            advice provided by the app.</li>


                    </ul>
                </div>
            </div>




            <div className=' mb-[32px] px-[24px]'>
                <h1 className=' mt-[24px] font-[500] text-[20px] '>
                    User Acknowledgment
                </h1>
                <div className=' text-[#828282] leasding-[19.2px] '>
                    <ul className=' list-disc '>
                        <li>  By using GoPrudy, users acknowledge and
                            agree to the terms outlined in this Data
                            Usage and Indemnification Clause. Users
                            understand that the app's data collection
                            and usage are limited to providing core
                            budgeting services, and that any broader
                            use of their data will require explicit
                            informed consent.
                        </li>

                    </ul>
                </div>
            </div>

        </div>
    )
}

export default page