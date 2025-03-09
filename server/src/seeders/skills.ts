

    fetching skills
    {
        const fetchSkills = async () => {
            const options = {
              method: 'GET',
              url: 'https://emsiservices.com/skills/versions/latest/skills',
              headers: { Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjNDNjZCRjIzMjBGNkY4RDQ2QzJERDhCMjI0MEVGMTFENTZEQkY3MUYiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJQR2FfSXlEMi1OUnNMZGl5SkE3eEhWYmI5eDgifQ.eyJuYmYiOjE3MTA4MzQ2NTcsImV4cCI6MTcxMDgzODI1NywiaXNzIjoiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20iLCJhdWQiOlsiZW1zaV9vcGVuIiwiaHR0cHM6Ly9hdXRoLmVtc2ljbG91ZC5jb20vcmVzb3VyY2VzIl0sImNsaWVudF9pZCI6InhqMWV1ZjllOGp6eXI1a3QiLCJlbWFpbCI6Im5hbmRha3VtYXJyZWRkeTY0NzhAZ21haWwuY29tIiwiY29tcGFueSI6IkJ1c2luZXNzUHJpc20iLCJuYW1lIjoiTmFuZGEga3VtYXIgUmVkZHkiLCJpYXQiOjE3MTA4MzQ2NTcsInNjb3BlIjpbImVtc2lfb3BlbiJdfQ.wClESDjMDann0To6YRLMshEZg35hLy1WcCntI0GmH4nKT0iw3W08olbcshOY6cpj4jzl70mchi9Sfex_Tvx-zLtauhlWV6qOZZblc35JEVKGSZg6JRG59Oqt327dDScbLFI-X2AHs97B-GagGyhBt5qXD1DV-0uJGwdlYkUbW0gphN-xLeBSFhNCfq_jkvLnJ1OR8RVfGQGH8WoKxiLr96rZ7cmWl0t4MRD0mhQzhF8_uCSvUVK9TPqmV5OOll-DV9F4Rw7UEuCvbMbxW7p_ihXdJg9TuTZIvaRTaqTH20FSwwezp5I0XPdqbMHpIiSvAl6UBcAmyoeErelWrWeNFA' },
            };
          
            return new Promise((resolve, reject) => {
              request(options, function (error, response, body) {
                if (error) {
                  reject(error);
                } else {
                  resolve(JSON.parse(body));
                }
              });
            });
          };
          
         
          const saveSkills = async (skillsData) => {
            try {
              console.log(skillsData)
              const skillsToSave = skillsData.data.map(skill => ({ name: skill.name }));
              await Skill.create(skillsToSave, { upsertMany: true });
              console.log('Skills saved successfully!');
            } catch (error) {
              console.error('Error saving skills:', error);
            }
          };
          
         
           const fetchSkillsFromExternalApi= async () => {
            try {
              const skillsData = await fetchSkills();
              await saveSkills(skillsData);
              res.json({ message: 'Skills fetched and saved successfully!' });
            } catch (error) {
              console.error('Error fetching or saving skills:', error);
              res.status(500).json({ message: 'Internal server error' });
            }
          };
        
          fetchSkillsFromExternalApi()
    }
    
    
    import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getEmsiToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      process.env.EMSI_AUTH_URL!,
      new URLSearchParams({
        client_id: process.env.EMSI_CLIENT_ID!,
        client_secret: process.env.EMSI_CLIENT_SECRET!,
        grant_type: "client_credentials",
        scope: process.env.EMSI_SCOPE!,
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    console.log("✅ EMSI JWT Token Retrieved!");
    return response.data.access_token;
  } catch (error) {
    console.error("❌ Error fetching EMSI token:", error.response?.data || error.message);
    return null;
  }
};

getEmsiToken().then((token) => console.log("JWT Token:", token));

    
const axios = require('request');

const options = {
  method: 'POST',
  url: 'https://auth.emsicloud.com/connect/token',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  form: {
    client_id: process.env.EMSI_CLIENT_ID,
    client_secret: process.env.EMSI_CLIENT_SECRET,
    grant_type: "client_credentials",
    scope: process.env.EMSI_SCOPE,
  }
};

axios(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

export const fetchSkillsFromExternalApi = async () => {
    try {
      const response = await axios.get("https://emsiservices.com/skills/versions/latest/skills", {
        headers: { Authorization: `Bearer ${process.env.SKILL_API_TOKEN}` },
      });
  
      const skillsData = response.data.data.map((skill: { name: string }) => ({
        name: skill.name,
      }));
  
     
      await Skill.bulkCreate(skillsData, {
        ignoreDuplicates: true,
      });
  
      console.log("Skills fetched and stored successfully!");
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };
  
 
  fetchSkillsFromExternalApi();
  